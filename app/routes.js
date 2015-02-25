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
        if(req.isAuthenticated()){
            res.redirect('/pro');
        }else{
            if(req.session.requestedActivation){
                delete req.session.requestedActivation;
                if(req.session.accountActivated){
                    delete req.session.accountActivated;
                    res.render('public/main.ejs', {amazonBucket: process.env.amazonBucket, requestedActivation:1, accountActivated: 1});
                }else{
                    res.render('public/main.ejs', {amazonBucket: process.env.amazonBucket, requestedActivation:1, accountActivated: 0});
                }
            }else{
                res.render('public/main.ejs', {amazonBucket: process.env.amazonBucket, requestedActivation: 0, accountActivated: 0});
            }
        }
    });

	// show the home page (will also have our login links)
	app.get('/pro', isLoggedIn, function(req, res) {
        transportUser(req, res);
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {

		req.logout();
        //encrypt sid using session secret
		res.redirect('/');
	});

    // RESET PASSWORD =================================================================================================

    //enter new password
    // ! used by multiple apps
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
    // ! used by multiple apps
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
		// LOGIN =============================== passport login - used by staywell core
		// process the login form
		app.post('/login', function (req, res, next) {
            //middleware to allow flashing messages on empty user/password fields
            if(!req.body.email || !req.body.password){
                return res.send({error: true, message: 'Campurile sunt obligatorii'});
            }else{
                passport.authenticate('local-login', function (err, user, info) {
                    console.log(err);
                    console.log(info);
                    if(err){
                        logger.log(err);
                        return res.send({error: true, message: "A aparut o eroare pe server"});
                    }else if(!user){
                        return res.send(info);
                    }else{
                        req.logIn(user, function (err) {
                            if(err){
                                return res.send({error: true, message: "A aparut o eroare pe server"});
                            }else{
                                if(user.state === "ACCEPTED"){
                                    return res.send({error: false, proof: true});
                                }else if(user.state === "PENDING"){
                                    return res.send({error: false, proof: false});
                                }else{
                                    //this final else should never be reached
                                    req.logout();
                                }
                            }
                        })
                    }
                })(req, res, next);
            }
        });

    //activate user account
    // ! used by mobile apps
    app.get('/activateAccount/:token', function(req, res) {
        res.redirect(307, '/apiMobileShared/activateAccount/'+req.params.token);
    });

    //activate user account
    // ! used by Staywell Core
    app.get('/activateAccountStaywell/:token', function (req, res) {
        //put a requestedActivation variable on this session
        //this is used for marking that an info modal needs
        //to be displayed after redirecting to the home page
        req.session.requestedActivation = true;
        User.findOne({ activationToken: req.params.token}, function(err, user) {
            if (!user) {
                logger.error(err);
                res.redirect('/');
            }else{
                user.enabled = true;
                user.activationToken = null;
                user.save(function (err, user) {
                    if(err){
                        logger.error(err);
                    }else{
                        //user was successfully activated
                        req.session.accountActivated = true;
                    }
                    res.redirect('/');
                });
            }
        });
    });

    //check if there is a user already registered wih email
    app.post('/checkEmailExists', function (req, res) {
        User.findOne({'username': {$regex: "^"+req.body.email.replace(/\+/g,"\\+")+"$", $options: "i"}}, function (err, user) {
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
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}

//validates user and transports it to a page taking it's role and/or state into account
var transportUser = function (req, res) {
    console.log("transport");
    User.findOne({_id: req.user._id}).select("+rolesID +state +proof_path").exec(function (err, user) {
        if(user.state === "ACCEPTED"){
            Roles.find({_id: {$in: user.rolesID}}, function (err, roles) {
                if(err){
                    req.logout();
                    res.redirect('/');
                }else{
                    if(roles[0]){
                        if(roles[0].authority === "ROLE_FARMACIST"){
                            console.log("medic");
                            res.render("medic/main.ejs", {user: req.user, amazonBucket: process.env.amazonBucket});
                        }else if(roles[0].authority === "ROLE_ADMIN"){
                            res.render("admin/main.ejs", {user: req.user, amazonBucket: process.env.amazonBucket});
                        }else if(roles[0].authority === "ROLE_STREAM_ADMIN") {
                            res.render("streamAdmin/main.ejs", {user: req.user, amazonBucket: process.env.amazonBucket});
                        }else {
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
    });
};