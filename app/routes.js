var User = require('./models/user');
var Roles = require('./models/roles');

var crypto   = require('crypto');
var async = require('async');

module.exports = function(app, email, logger, passport) {

    //access control origin
    app.all("/*", function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
        next();
        // just move on to the next route handler
    });

// normal routes ===============================================================

    app.get('/', function (req, res) {
        res.render('public/main.ejs', {amazonBucket: process.env.amazonBucket});
    });

	// show the home page (will also have our login links)
	app.get('/pro', isLoggedIn, function(req, res) {
        transportUser(req, res, {
            "ROLE_FARMACIST": "medic/main.ejs",
            "ROLE_ADMIN": "admin/main.ejs"
        }, true);
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
        transportUser(req, res, {
            "ROLE_FARMACIST": "medic/profile.ejs",
            "ROLE_ADMIN": "admin/profile.ejs"
        }, true);
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

    // RESET PASSWORD =================================================================================================

    //render password reset form
    app.get('/forgot', function(req, res) {
        res.render('forgotPass.ejs');
    });

    //generate token for resetting user password
    app.post('/forgot', function(req, res) {
        async.waterfall([
            //generate unique token
            function(done) {
                crypto.randomBytes(40, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {
                //find user
                User.findOne({ username: req.body.email }, function(err, user) {
                    if (!user) {
                        res.render('forgotPass.ejs', {message : {message: 'Nu a fost gasit un cont pentru acest e-mail.', type: 'danger'}});
                    }else{
                        //set token for user - expires in one hour
                        User.update({_id: user._id.toString()}, {
                            resetPasswordToken: token,
                            resetPasswordExpires: Date.now() + 3600000
                        }, function(err, data) {
                            done(err, token, user);
                        });
                    }
                });
            },
            function(token, user, done) {
                //email user
                email({from: 'adminMSD@qualitance.ro',
                    to: [user.username],
                    subject:'Resetare parola MSD',
                    text: 'Ati primit acest email deoarece a fost ceruta resetarea parolei pentru contul dumneavoastra de MSD.\n\n' +
                          'Va rugam accesati link-ul de mai jos (sau copiati link-ul in browser) pentru a va reseta parola:\n\n' +
                          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                          'Link-ul este valabil maxim o ora\n'+
                          'Daca nu ati cerut resetarea parolei, va rugam sa ignorati acest e-mail si parola va ramane neschimbata\n'
                }, function(err){
                    done(err, user.username);
                });
            }
        ], function(err, user) {
            if (err){
                logger.error(err);
                res.render('forgotPass.ejs', {message : {message: 'A aparut o eroare. Va rugam verificati datele', type: 'danger'}});
            }else{
                res.render('forgotPass.ejs', {message : {message: 'Un email cu instructiuni a fost trimis catre ' + user + '.', type: 'info'}});
            }
        });
    });

    //enter new password
    app.get('/reset/:token', function(req, res) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                res.render('forgotPass.ejs', {message : {message: 'Link-ul a expirat sau este invalid. Va rugam introduceti din nou email-ul', type: 'danger'}});
            }else{
                res.render('resetPass.ejs');
            }
        });
    });

    //change user password
    app.post('/reset/:token', function(req, res) {
        //validate form
        //check if new password length is valid
        if(req.body.password.toString().length < 6 || req.body.password.toString().length > 32){
            res.render('resetPass.ejs', {message : {message: 'Parola trebuie sa contina intre 6 si 32 de caractere', type: 'danger'}});
        }else{
            //check if passwords match
            if(req.body.password !== req.body.confirm){
                res.render('resetPass.ejs', {message : {message: 'Parolele nu corespund', type: 'danger'}});
            }else{
                //find user by token
                User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                    if (!user) {
                        res.render('forgotPass.ejs', {message : {message: 'Link-ul a expirat sau este invalid. Va rugam introduceti din nou mail-ul', type: 'danger'}});
                    }else{
                        //change user pass
                        User.update({resetPasswordToken: req.params.token}, {
                            password: user.generateHash(req.body.password),
                            resetPasswordToken: null,
                            resetPasswordExpires: null,
                            enabled: true
                        }, function (err, data) {
                            if(err){
                                res.render('forgotPass.ejs', {message : {message: 'A aparut o eroare la actualizare. Va rugam introduceti din nou email-ul', type: 'danger'}});
                            }else{
                                //email user
                                email({from: 'adminMSD@qualitance.ro',
                                    to: [user.username],
                                    subject:'Resetare parola MSD',
                                    text: 'Buna ziua,\n\n\n' +
                                          'Parola pentru contul dumneavoastra a fost modificata.\n\n\nO zi buna,\nAdmin MSD'
                                }, function(err){
                                    if(err){
                                        res.render('forgotPass.ejs', {message : {message: 'Parola a fost schimbata.', type: 'success'}});
                                    }else{
                                        res.render('forgotPass.ejs', {message : {message: 'Parola a fost schimbata. Veti primi in scurt timp un e-mail de confirmare.', type: 'success'}});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });

    //====================================================================================================== access merck manual
    app.get('/merckManual', isLoggedIn, function (req, res) {
//        console.log("======================================================================");
//        var range = req.headers.range;
//        if(range){
//            var brk = range.toString().match(/(.*)=(\d*)-(\d*)/);
//            var noBytes = parseInt(brk[3])-parseInt(brk[2]);
//            console.log(parseInt(brk[3])-parseInt(brk[2]));
//            if(noBytes>65535 && noBytes!=1048575){
//                res.status(401).end();
//            }else{
//                res.sendFile('/private_storage/merck.pdf', {root: __dirname});
//            }
//        }else{
//            console.log("no range");
//            res.status(401).end();
//        }
        res.sendFile('/private_storage/merck.pdf', {root: __dirname});
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('auth.ejs', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/pro', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { info: {}});
		});

		// process the signup form
		app.post('/signup', function(req, res, next) {
            passport.authenticate('local-signup', function(err, user, info){
                if(err) { return next(err); }
                if(!user) { return res.render('signup.ejs', {info: info}); }
                //email user
                email({from: 'adminMSD@qualitance.ro',
                    to: [user.username],
                    subject:'Activare cont MSD',
                    text: 'Ati primit acest email deoarece v-ati inregistrat pe MSD Staywell.\n\n' +
                        'Va rugam accesati link-ul de mai jos (sau copiati link-ul in browser) pentru a va activa contul:\n\n' +
                        'http://' + req.headers.host + '/activateAccount/' + user.activationToken + '\n\n' +
                        'Link-ul este valabil maxim o ora\n'+
                        'Daca nu v-ati creat cont pe MSD, va rugam sa ignorati acest e-mail\n'
                }, function(err){
                    if(err) { return next(err); }
                    res.render('accountActivation.ejs', {pending: true, success: false});
                });
            })(req, res, next);
        });

        //activate user account
        app.get('/activateAccount/:token', function(req, res) {
            User.findOne({ activationToken: req.params.token}, function(err, user) {
                if (!user) {
                    res.render('signup.ejs', {info: {message : 'Link-ul de activare nu este valid. Pentru a va crea un cont, folositi formularul de mai jos'}});
                }else{
                    user.enabled = true;
                    user.activationToken = null;
                    user.save(function (err, user) {
                        if(err){
                            res.render('accountActivation.ejs', {pending: false, success: false});
                        }else{
                            res.render('accountActivation.ejs', {pending: false, success: true});
                        }
                    });
                }
            });
        });

    //check if there is a user already registered wih email
    app.post('/checkEmailExists', function (req, res) {
        User.findOne({'username': {$regex: new RegExp("^"+req.body.email, "i")}}, function (err, user) {
            if(err){
                res.status(500).end();
            }else{
                if(!user){
                    res.send({exists: false});
                }else{
                    res.send({exists: true});
                }
            }
        })
    });

//	// facebook -------------------------------
//
//		// send to facebook to do the authentication
//		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
//
//		// handle the callback after facebook has authenticated the user
//		app.get('/auth/facebook/callback',
//			passport.authenticate('facebook', {
//				successRedirect : '/',
//				failureRedirect : '/'
//			}));
//
//	// twitter --------------------------------
//
//		// send to twitter to do the authentication
//		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));
//
//		// handle the callback after twitter has authenticated the user
//		app.get('/auth/twitter/callback',
//			passport.authenticate('twitter', {
//				successRedirect : '/',
//				failureRedirect : '/'
//			}));
//
//
//	// google ---------------------------------
//
//		// send to google to do the authentication
//		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
//
//		// the callback after google has authenticated the user
//		app.get('/auth/google/callback',
//			passport.authenticate('google', {
//				successRedirect : '/',
//				failureRedirect : '/'
//			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

//	// locally --------------------------------
//		app.get('/connect/local', function(req, res) {
//			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
//		});
//		app.post('/connect/local', passport.authenticate('local-signup', {
//			successRedirect : '/', // redirect to the secure profile section
//			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
//			failureFlash : true // allow flash messages
//		}));
//
//	// facebook -------------------------------
//
//		// send to facebook to do the authentication
//		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));
//
//		// handle the callback after facebook has authorized the user
//		app.get('/connect/facebook/callback',
//			passport.authorize('facebook', {
//				successRedirect : '/',
//				failureRedirect : '/'
//			}));
//
//	// twitter --------------------------------
//
//		// send to twitter to do the authentication
//		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));
//
//		// handle the callback after twitter has authorized the user
//		app.get('/connect/twitter/callback',
//			passport.authorize('twitter', {
//				successRedirect : '/',
//				failureRedirect : '/'
//			}));
//
//
//	// google ---------------------------------
//
//		// send to google to do the authentication
//		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));
//
//		// the callback after google has authorized the user
//		app.get('/connect/google/callback',
//			passport.authorize('google', {
//				successRedirect : '/',
//				failureRedirect : '/'
//			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

//	// local -----------------------------------
//	app.get('/unlink/local', isLoggedIn, function(req, res) {
//		var user            = req.user;
//		user.local.email    = undefined;
//		user.local.password = undefined;
//		user.save(function(err) {
//			res.redirect('/');
//		});
//	});
//
//	// facebook -------------------------------
//	app.get('/unlink/facebook', isLoggedIn, function(req, res) {
//		var user            = req.user;
//		user.facebook.token = undefined;
//		user.save(function(err) {
//			res.redirect('/');
//		});
//	});
//
//	// twitter --------------------------------
//	app.get('/unlink/twitter', isLoggedIn, function(req, res) {
//		var user           = req.user;
//		user.twitter.token = undefined;
//		user.save(function(err) {
//			res.redirect('/');
//		});
//	});
//
//	// google ---------------------------------
//	app.get('/unlink/google', isLoggedIn, function(req, res) {
//		var user          = req.user;
//		user.google.token = undefined;
//		user.save(function(err) {
//			res.redirect('/');
//		});
//	});
//
//
//
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}

function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated())
        return next();

    res.redirect('/');
}

//validates user and transports it to a page taking it's role into account
//args:
//paths = {"role": "page", ...}
//sendUserInfo = boolean
var transportUser = function (req, res, paths, sendUserInfo) {
    if(req.user.enabled && !req.user.account_locked &&!req.user.account_expired){
        Roles.find({_id: {$in: req.user.rolesID}}, function (err, roles) {
            if(err){
                req.logout();
                res.redirect('/');
            }else{
                if(roles[0]){
                    if(paths[roles[0].authority]){
                        if(sendUserInfo){
                            res.render(paths[roles[0].authority], {user: req.user, amazonBucket: process.env.amazonBucket});
                        }else{
                            res.render(paths[roles[0].authority]);
                        }
                    }else{
                        req.logout();
                        res.redirect('/');
                    }
                }else{
                    req.logout();
                    res.redirect('/');
                }
            }
        });
    }else{
        req.logout();
        req.flash('loginMessage', 'Contul nu este activat sau a expirat');
        res.redirect('/login');
    }
};