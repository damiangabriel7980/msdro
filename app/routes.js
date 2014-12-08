var User = require('./models/user');
var Roles = require('./models/roles');

module.exports = function(app, passport) {

// normal routes ===============================================================

    app.get('/', function (req, res) {
        res.render('public/main.ejs');
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

    //access merck manual
    app.get('/merckManual', isLoggedIn, function (req, res) {
        console.log("======================================================================");
        var range = req.headers.range;
        if(range){
            var brk = range.toString().match(/(.*)=(\d*)-(\d*)/);
            var noBytes = parseInt(brk[3])-parseInt(brk[2]);
            console.log(parseInt(brk[3])-parseInt(brk[2]));
            if(noBytes>65535 && noBytes!=1048575){
                res.status(401).end();
            }else{
                res.sendFile('/private_storage/merck.pdf', {root: __dirname});
            }
        }else{
            console.log("no range");
            res.status(401).end();
        }
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
		app.get('/signup', isNotLoggedIn, function(req, res) {
			res.render('signup.ejs', { message: req.flash('signupMessage') });
		});

		// process the signup form
		app.post('/signup', isNotLoggedIn, passport.authenticate('local-signup', {
			successRedirect : '/', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

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
    if(req.user.enabled && !req.user.account_locked &&!req.user.account_expired && req.user.state === "ACCEPTED"){
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
        res.redirect('/');
    }
};