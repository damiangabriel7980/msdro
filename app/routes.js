var Config = require('../config/environment.js'),
    my_config = new Config();

//set following variable to true if you want to disable patients area
const DISABLE_PATIENTS = my_config.disablePatients;

var User = require('./models/user');
var Roles = require('./models/roles');

var MailerModule = require('./modules/mailer');
var UtilsModule = require('./modules/utils');
var SessionStorage = require('./modules/sessionStorage');

var crypto   = require('crypto');
var async = require('async');

var MAIN_VIEW;
if(DISABLE_PATIENTS){
    MAIN_VIEW = 'noPatients/main.ejs';
}else{
    MAIN_VIEW = 'public/main.ejs';
}

module.exports = function(app, logger, passport) {

    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);

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
        var requestedPRO= 0, requestedActivation = 0, accountActivated = 0, showLogin = 0, accessRoute="", GA_code = my_config.GA_code;
        if(req.query._escaped_fragment_){
            // _escaped_fragment_ holds a route that a crawler tries to access
            // the crawler doesn't know how to access routes, so we will send
            // a message in front-end to programatically access that route
            accessRoute = req.query._escaped_fragment_;
        }
        if(req.isAuthenticated()){
            res.redirect('/pro');
        }else{
            if(req.session.requestedPRO){
                requestedPRO = 1;
                delete req.session.requestedPRO;
            }
            if(req.session.requestedActivation){
                requestedActivation = 1;
                delete req.session.requestedActivation;
            }
            if(req.session.accountActivated){
                accountActivated = 1;
                delete req.session.accountActivated;
            }
            if(req.session.showLogin){
                showLogin = 1;
                delete req.session.showLogin;
            }
            res.render(MAIN_VIEW, {
                amazonBucket: my_config.amazonBucket,
                amazonPrefix: my_config.amazonPrefix,
                requestedPRO: requestedPRO,
                requestedActivation: requestedActivation,
                accountActivated: accountActivated,
                showLogin: showLogin,
                accessRoute: accessRoute,
                GA_code: GA_code
            });
        }
    });

	// show the home page (will also have our login links)
	app.get('/pro', function(req, res) {
        if(req.isAuthenticated()){
            transportUser(req, res);
        }else if(req.url === "/pro"){
            req.session.requestedPRO = 1;
            res.redirect('/login');
        }else{
            res.redirect('/');
        }
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
        //delete presentations viewed status from current session
        SessionStorage.setElement(req, "viewedIntroPresentations", {});
        //logout
		req.logout();
        //redirect to main
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
                User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).select('+title').exec(function(err, user) {
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
                                var emailTo = [{email: user.username, name: user.name}];
                                var templateContent = [
                                    {
                                        "name": "title",
                                        "content": user.getEmailTitle()
                                    },
                                    {
                                        "name": "name",
                                        "content": user.name
                                    }
                                ];
                                MailerModule.send(
                                    "Staywell_completedReset",
                                    templateContent,
                                    emailTo,
                                    'Resetare parola MSD'
                                ).then(
                                    function (success) {
                                        res.render('resetPass.ejs', {message : {message: 'Parola a fost schimbata. Veti primi in scurt timp un e-mail de confirmare.', type: 'success'}});
                                    },
                                    function (err) {
                                        res.render('resetPass.ejs', {message : {message: 'Parola a fost schimbata.', type: 'success'}});
                                    }
                                );
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

    app.get('/sitemap', function (req, res) {
        res.sendFile('/private_storage/sitemap.xml', {root: __dirname});
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
                return handleError(res, null, 400, 15);
            }else{
                passport.authenticate('local-login', function (err, user, info) {
                    console.log(err);
                    if(err){
                        return handleError(res, err);
                    }else if(!user){
                        return handleError(res, null, 403, info.code);
                    }else{
                        req.logIn(user, function (err) {
                            if(err){
                                return handleError(res, err);
                            }else{
                                if(user.state === "ACCEPTED"){
                                    if (req.body.remember===true) {
                                        req.session.cookie.maxAge = 3600000*24; // 24 hours
                                    } else {
                                        req.session.cookie.expires = false;
                                    }

                                    {
                                        var statusModalGroups={};
                                        for(var i=0;i<user.groupsID.length;i++)
                                        {
                                            statusModalGroups[user.groupsID[i]]=true;

                                        }
                                        req.session.statusModalGroups=statusModalGroups;

                                        return handleSuccess(res, {accepted: true});
                                    }
                                }else if(user.state === "PENDING"){
                                    return handleSuccess(res, {accepted: false});
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
    
    //redirect user to home page and open login
    app.get('/login', function (req, res) {
        req.session.showLogin = true;
        res.redirect('/');
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
            if (err || !user) {
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
        User.findOne({'username': UtilsModule.regexes.emailQuery(req.body.email)}, function (err, user) {
            if(err){
                handleError(res, err);
            }else{
                if(!user){
                    handleSuccess(res, {exists: false});
                }else{
                    handleSuccess(res, {exists: true});
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

    User.findOne({_id: req.user._id}).select("+rolesID +state +proof_path").exec(function (err, user) {
        if(user.state === "ACCEPTED"){
            Roles.find({_id: {$in: user.rolesID}}, function (err, roles) {
                if(err){
                    req.logout();
                    res.redirect('/');
                }else{
                    if(roles[0]){
                        if(roles[0].authority === "ROLE_FARMACIST"){

                            res.render("medic/main.ejs", {user: req.user, amazonBucket: my_config.amazonBucket, amazonPrefix: my_config.amazonPrefix, GA_code: my_config.GA_code});
                        }else if(roles[0].authority === "ROLE_ADMIN"){
                            res.render("admin/main.ejs", {user: req.user, amazonBucket: my_config.amazonBucket, amazonPrefix: my_config.amazonPrefix, GA_code: my_config.GA_code});
                        }else if(roles[0].authority === "ROLE_STREAM_ADMIN") {
                            res.render("streamAdmin/main.ejs", {user: req.user, amazonBucket: my_config.amazonBucket, amazonPrefix: my_config.amazonPrefix, GA_code: my_config.GA_code});
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