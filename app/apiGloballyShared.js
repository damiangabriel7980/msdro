var User = require('./models/user');
var UserGroup = require('./models/userGroup');
var ActivationCodes =require('./models/activationCodes');
var Roles=require('./models/roles');
var Professions = require('./models/professions');
var Counties = require('./models/counties');
var Parameters = require('./models/parameters');
var Divisions = require('./models/divisions/divisions');
var Speciality = require('./models/specialty');
var Job = require('./models/jobs');
var passport = require('passport');
var mongoose = require('mongoose');
var validator = require('validator');
var crypto   = require('crypto');
var async = require('async');
var SHA512   = require('crypto-js/sha512');

var MailerModule = require('./modules/mailer');
var UtilsModule = require('./modules/utils');
var Config = require('../config/environment');

//configure winston logger
var logger = require('../config/winston');

//passport
require('../config/passport')(passport, logger); // pass passport for configuration

const activationPrefixStaywell = function (hostname) {
    return 'http://' + hostname + '/activateAccountStaywell/';
};
const activationPrefixMobile = function (hostname) {
    return 'http://' + hostname + '/apiMobileShared/activateAccount/';
};
const resetPasswordPrefix = function (hostname) {
    return 'http://' + hostname + '/reset/';
};

var mergeKeys = function (obj1, obj2){
    var obj3 = {};
    for (var attrname in obj1) {
        if(obj1.hasOwnProperty(attrname)){
            obj3[attrname] = obj1[attrname];
        }
    }
    for (var attrname in obj2) {
        if(obj2.hasOwnProperty(attrname)){
            obj3[attrname] = obj2[attrname];
        }
    }
    return obj3;
};

module.exports = function(app, env, logger, amazon, sessionSecret, router) {

    //=============================================Define variables
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);
    var Auth = require('./modules/auth')(logger, sessionSecret);

    //access control allow origin *
    app.all("/apiGloballyShared/*", function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
        next();
    });

    //route for retrieving environment info; CAREFUL NOT TO INCLUDE SENSIBLE DATA
    router.route('/appSettings')
        .get(function (req, res) {
            handleSuccess(res, {
                amazonPrefix: env.amazonPrefix + env.amazonBucket + "/"
            });
        });

//==================================================================================================== activate account
    var generateToken = function (username, callback) {
        crypto.randomBytes(40, function(err, buf) {
            if(err){
                callback(err);
            }else{
                var activationToken = buf.toString('hex');
                User.update({username: UtilsModule.regexes.emailQuery(username)}, {$set: {activationToken: activationToken}}, function (err, wres) {
                    if(err){
                        callback(err);
                    }else{
                        callback(null, activationToken);
                    }
                });
            }
        });
    };

//===================================================================================================================== create account

    var validateCreateAccount = function (req, res, next) {
        var namePatt = UtilsModule.regexes.name;

        var user = req.body.user || {};

        var title = req.body.title || user.title || "";
        var name = req.body.name || user.name || "";
        var email = req.body.email || user.username || "";
        var password = req.body.password || user.password || "";
        var registeredFrom = req.body.registeredFrom || user.registeredFrom || "";
        var job = req.body.job || user.job || "";
        var newJob = new Job({
            job_name: job
        })

        //console.log(name.replace(/ /g,'').replace(/-/g,'').replace(/\./g,''));

        //validate data
        if(!UtilsModule.validateEmail(email)){
            handleError(res, null, 400, 31);
        }else if(!namePatt.test(name)){
            handleError(res, null, 400, 261);
        }else if(password.length < 6 || password.length > 32){
            handleError(res, null, 400, 10);
        }else{
            User.findOne({username: UtilsModule.regexes.emailQuery(email)}, function(err, user) {
                //if there are any errors, return the error
                if(err){
                    handleError(res, err);
                }else if(user) {
                    // check to see if there's already a user with that email
                    handleError(res ,null, 400, 32);
                }else{
                    //data is valid
                    //get default role
                    Roles.findOne({'authority': 'ROLE_FARMACIST'}, function (err, role) {
                        if(err || !role){
                            handleError(res, err);
                        }else{
                            newJob.save(function(err,savedJob) {
                                if(err){
                                    handleError(res,null,400,2);
                                }
                                else{
                                    req.staywellUser = {
                                        rolesID: [role._id.toString()],
                                        title: title,
                                        jobsID: [savedJob._id],
                                        name: name,
                                        username: email,
                                        password: new User().generateHash(password),
                                        state: "PENDING", //proof verification status
                                        account_expired: false,
                                        account_locked: false,
                                        enabled: false, //email verification status
                                        created: Date.now(),
                                        last_updated: Date.now(),
                                        registeredFrom: registeredFrom
                                    };
                                    next();
                                }
                            })

                        }
                    });
                }
            });
        }
    };

    var validateCompleteProfile = function (req, res, next) {
        var staywellUser = req.staywellUser || {};

        try{
            var activation = req.body.activation || {};

            //make sure only the info provided in the form is updated
            UtilsModule.allowFields(req.body.user, ['profession','groupsID','practiceType','address','citiesID','phone','subscriptions','specialty','job', 'temp', 'password']);
            req.body.password = req.body.user.password;
            var userData = req.body.user;
            delete userData.password;
            userData.groupsID = userData.groupsID || [];

            var phonePatt = UtilsModule.regexes.phone;

            var proofRequired;
            if(req.user){
                proofRequired = isProofRequired(req.user.username);
            }else{
                proofRequired = isProofRequired(staywellUser.username);
            }

            if(proofRequired && activation.type !== "code" && activation.type !== "file"){
                handleError(res, null, 400, 33);
            }else if(proofRequired && activation.type === "file" && !(activation.value.extension && activation.value.file)){
                handleError(res, null, 400, 34);
            }else if(proofRequired && activation.type === "code" && !activation.value){
                handleError(res, null, 400, 35);
            }else if(!userData.profession){
                handleError(res, null, 400, 36);
            }else{
                UserGroup.find({profession: userData.profession, show_at_signup: true}, function(err, availableGroups){
                    if(err){
                        handleError(res, err);
                    }else{
                        if(!userData.address){
                            handleError(res, null, 400, 28);
                        }else if(!userData.job){
                            handleError(res, null, 400, 53);
                        }else if(!userData.citiesID){
                            handleError(res, null, 400, 38);
                        }else if(userData.phone && !phonePatt.test(userData.phone)){
                            handleError(res, null, 400, 27);
                        }else{
                            //establish default user group
                            UserGroup.findOne({profession: userData.profession, display_name: "Default"}, function (err, group) {
                                if(err || !group){
                                    handleError(res, err);
                                }else{
                                    //establish groups ids
                                    userData.groupsID.push(group._id.toString());
                                    //validate activation code / proof
                                    if(!proofRequired){
                                        staywellUser.state = "ACCEPTED";
                                        req.staywellUser = mergeKeys(staywellUser, userData);
                                        next();
                                    }else if(activation.type === "code"){
                                        //validate code
                                        //ActivationCodes.findOne({profession: userData.profession}).select('+value').exec(function (err, code) {
                                        //    if(err || !code){
                                        //        handleError(res, err);
                                        //    }else{
                                        //        if(!activation.value || (SHA512(activation.value).toString() !== code.value)){
                                        //            handleError(res, null, 403, 351);
                                        //        }else{
                                        //            staywellUser.state = "ACCEPTED";
                                        //            req.staywellUser = mergeKeys(staywellUser, userData);
                                        //            next();
                                        //        }
                                        //    }
                                        //});

                                        Divisions.findOne({ $or: [ { code: SHA512(activation.value).toString()}, {code: activation.value}]}).exec(function (err, division) {
                                            if(err || !division){
                                                handleError(res ,null, 400, 351);
                                            }else{
                                                if(!activation.value || (SHA512(activation.value).toString() !== division.code && !req.body.user.temp.comesFromPreview) || (division.code !== activation.value && req.body.user.temp.comesFromPreview)){
                                                    handleError(res, null, 403, 351);
                                                }else{
                                                    staywellUser.division = division;
                                                    staywellUser.state = "ACCEPTED";
                                                    staywellUser.date_created = Date.now();
                                                    staywellUser.expiration_date = new Date();
                                                    staywellUser.expiration_date.setDate((new Date(staywellUser.date_created)).getDate() + 2);
                                                    //var creationDate = new Date(staywellUser.date_created);
                                                    //staywellUser.expiration_date = addMinutes(creationDate, 5);
                                                    if(req.body.user.temp.comesFromPreview) {
                                                        staywellUser.temporaryAccount = true;
                                                    }
                                                    req.staywellUser = mergeKeys(staywellUser, userData);
                                                    next();
                                                }
                                            }
                                        });
                                    }else{
                                        //validate proof
                                        if(activation.value && typeof activation.value.extension === "string" && typeof activation.value.file === "string"){
                                            staywellUser.state = "PENDING";
                                            req.staywellUser = mergeKeys(staywellUser, userData);
                                            req.staywellProof = activation.value;
                                            next();
                                        }else{
                                            handleError(res, null, 500, 39);
                                        }
                                    }
                                }
                            });
                        }
                    }
                })
            }
        }catch(ex){
            handleError(res, err);
        }
    };

    function isProofRequired(email){
        email = email || "";
        if(email.split("@")[1] === env.user.noProofDomain){
            return false;
        }else{
            return true;
        }
    }

    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes*60000);
    }

    var uploadProof = function (req, res, next) {

        var staywellUser = req.staywellUser || {};
        var userEmail = staywellUser.username || req.user.username;

        var staywellProof = req.staywellProof;

        if(staywellUser.state === "ACCEPTED"){
            next();
        }else if(!staywellProof){
            handleError(res, null, 500, 39);
        }else if(!userEmail){
            handleError(res, null, 500, 39);
        }else{
            User.findOne({username: UtilsModule.regexes.emailQuery(userEmail)}).exec(function (err, user) {
                if(err || !user){
                    handleError(res, err);
                }else{
                    var key = "user/"+user._id+"/proof."+staywellProof.extension;
                    amazon.addObjectS3(key, staywellProof.file, function (err) {
                        if (err){
                            handleError(res, null, 500, 39);
                        }else{
                            User.update({_id: user._id}, {$set: {proof_path: key}}, function (err, wres) {
                                if(err){
                                    handleError(res, null, 500, 39);
                                }else{
                                    next();
                                }
                            });
                        }
                    });
                }
            });
        }
    };

    var createAccount = function (req, res, next) {

        var user = new User(req.staywellUser);
        user.save(function (err, saved) {
            if(err){
                handleError(res, err);
            }else{
                req.staywellUser._id = saved._id;
                next();
            }
        });
    };

    var completeProfile = function (req, res, next) {

        User.update({_id: req.user._id}, {$set: req.staywellUser}, function (err, wres) {
            if(err){
                handleError(res, err);
            }else{
                next();
            }
        });
    };

    var notifyAdmin = function (user_id) {
        User.findOne({_id: user_id}).select('+state').exec(function (err, user) {
            if(user && user.state === "PENDING"){
                //get mail_to value
                Parameters.findOne({name: "TO_EMAIL"}, function (err, to_email) {
                    if(to_email){
                        MailerModule.send(
                            "Staywell_user_pending",
                            [
                                {
                                    "name": "user_email",
                                    "content": user.username
                                }
                            ],
                            [{email: to_email.value || to_email.default_value}],
                            "Utilizator in asteptare"
                        );
                    }
                });
            }
        });
    };

    router.route('/createAccountStaywell')
        .post(validateCreateAccount, validateCompleteProfile, createAccount, uploadProof, function (req, res, next) {
            var info = {
                error: false,
                type: "success",
                user: req.staywellUser.username,
                state: req.staywellUser.state
            };

            if(req.staywellUser.temporaryAccount) {
                req.body.email = info.user;
                passport.authenticate('local-login', function (err, user, info) {
                    console.log(err);
                    if (err) {
                        return handleError(res, err);
                    } else if (!user) {
                        return handleError(res, null, 403, info.code);
                    } else {

                        req.logIn(user, function (err) {
                            if (err) {
                                return handleError(res, err);
                            } else {
                                if (user.temporaryAccount) {
                                    if (Date.now() > user.expiration_date) {
                                        return handleError(res, null, 403, 17);
                                    }
                                }

                                notifyAdmin(req.staywellUser._id);

                                if(req.staywellUser.state === "ACCEPTED"){
                                    generateToken(req.staywellUser.username, function (err, activationToken) {
                                        var activationLink = activationPrefixStaywell(req.headers.host) + activationToken;
                                        var emailTo = [{email: req.staywellUser.username, name: req.staywellUser.name}];

                                        MailerModule.send(
                                            Config().createAccountTemplate,
                                            [
                                                {
                                                    "name": "title",
                                                    "content": new User({title: req.staywellUser.title}).getEmailTitle()
                                                },
                                                {
                                                    "name": "name",
                                                    "content": req.staywellUser.name
                                                },
                                                {
                                                    "name": "activationLink",
                                                    "content": activationLink
                                                }
                                            ],
                                            emailTo,
                                            'Activare cont MSD',
                                            {
                                                "name": "activationLink",
                                                "content": activationLink
                                            }
                                        ).then(
                                            function (success) {
                                                //do nothing
                                            },
                                            function (err) {
                                                logger.error(err);
                                            }
                                        );
                                    });
                                }

                                if (user.state === "ACCEPTED") {
                                    if (req.body.remember === true) {
                                        req.session.cookie.maxAge = 3600000 * 24; // 24 hours
                                    } else {
                                        req.session.cookie.expires = false;
                                    }
                                    return handleSuccess(res, user);
                                } else if (user.state === "PENDING") {
                                    return handleSuccess(res, {accepted: false});
                                } else {
                                    //this final else should never be reached
                                    req.logout();
                                }
                            }
                        })

                    }
                })(req, res, next);
            } else {
                handleSuccess(res, info);
                notifyAdmin(req.staywellUser._id);

                if(req.staywellUser.state === "ACCEPTED"){
                    generateToken(req.staywellUser.username, function (err, activationToken) {
                        var activationLink = activationPrefixStaywell(req.headers.host) + activationToken;
                        var emailTo = [{email: req.staywellUser.username, name: req.staywellUser.name}];

                        MailerModule.send(
                            Config().createAccountTemplate,
                            [
                                {
                                    "name": "title",
                                    "content": new User({title: req.staywellUser.title}).getEmailTitle()
                                },
                                {
                                    "name": "name",
                                    "content": req.staywellUser.name
                                },
                                {
                                    "name": "activationLink",
                                    "content": activationLink
                                }
                            ],
                            emailTo,
                            'Activare cont MSD',
                            {
                                "name": "activationLink",
                                "content": activationLink
                            }
                        ).then(
                            function (success) {
                                //do nothing
                            },
                            function (err) {
                                logger.error(err);
                            }
                        );
                    });
                }
            }
        });

    router.route('/completeProfile')
        .post(Auth.isLoggedIn, validateCompleteProfile, completeProfile, uploadProof, function (req,res) {
            var info = {
                error: false,
                type: "success",
                user: req.user.username,
                state: req.staywellUser.state
            };
            handleSuccess(res, info);
            notifyAdmin(req.user._id);
        });

    router.route('/createAccountMobile')
        .post(validateCreateAccount, createAccount, function (req, res) {
            var info = {
                user: req.staywellUser.username,
                state: req.staywellUser.state
            };
            handleSuccess(res, info);

            generateToken(req.staywellUser.username, function (err, activationToken) {
                if(err){
                    logger.error(err);
                }else{
                    var activationLink = activationPrefixMobile(req.headers.host) + activationToken;
                    var emailTo = [{email: req.staywellUser.username, name: req.staywellUser.name}];

                    MailerModule.send(
                        Config().createAccountMobileTemplate,
                        [
                            {
                                "name": "title",
                                "content": new User({title: req.staywellUser.title}).getEmailTitle()
                            },
                            {
                                "name": "name",
                                "content": req.staywellUser.name
                            },
                            {
                                "name": "activationLink",
                                "content": activationLink
                            }
                        ],
                        emailTo,
                        'Activare cont MSD',
                        {
                            "name": "activationLink",
                            "content": activationLink
                        }
                    ).then(
                        function (success) {
                            //do nothing
                        },
                        function (err) {
                            logger.error(err);
                        }
                    );
                }
            });
        });

    router.route('/accountActivation/professions')
        .get(function (req, res) {
            Professions.find({}).exec(function (err, professions) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, professions);
                }
            });
        });
    router.route('/accountActivation/specialty')
        .get(function (req, res) {
            Speciality.find({enabled: true}).exec(function (err, specialities) {
                if (err) {
                    handleError(res, err, 500)
                } else {
                    handleSuccess(res, specialities);
                }
            });
        });

    router.route('/accountActivation/signupGroups/:profession')
        .get(function (req, res) {
            var profession = req.params.profession;
            if(profession){
                profession = mongoose.Types.ObjectId(profession.toString());
                UserGroup.find({show_at_signup: true, profession: profession}).sort({display_name: 1}).exec(function (err, groups) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, groups);
                    }
                });
            }else{
                handleSuccess(res, []);
            }
        });

    router.route('/accountActivation/counties')
        .get(function (req, res) {
            Counties.find({}).sort({name: 1}).exec(function (err, counties) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, counties);
                }
            });
        });

    router.route('/accountActivation/cities')
        .get(function (req, res) {
            if(!req.query.county){
                handleError(res, null, 400);
            }else{
                Counties.findOne({_id: req.query.county}).populate('citiesID').exec(function (err, county) {
                    if(err){
                        handleError(res, err);
                    }else if(!county){
                        handleError(res, null, 400);
                    }else{
                        handleSuccess(res, county.citiesID);
                    }
                });
            }
        });


//============================================================================================= generate token for resetting user password
    router.route('/requestPasswordReset')
        .post(function(req, res) {
            
            
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
                    User.findOne({ username: UtilsModule.regexes.emailQuery(req.body.email)}).select('+title').exec(function(err, user) {
                        if (!user) {
                            handleError(res, null, 400, 311);
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
                    var emailTo = [{email: user.username, name: user.name}];
                    var templateToUse = Config().resetPasswordTemplate;
                    MailerModule.send(
                        templateToUse,
                        [
                            {
                                "name": "title",
                                "content": user.getEmailTitle()
                            },
                            {
                                "name": "name",
                                "content": user.name
                            },
                            {
                                "name": "resetLink",
                                "content": resetPasswordPrefix(req.headers.host) + token
                            }
                        ],
                        emailTo,
                        'Resetare parola MSD',
                        {
                            "name": "resetLink",
                            "content": resetPasswordPrefix(req.headers.host) + token
                        }
                    ).then(
                        function () {
                            done(false, user.username);
                        },
                        function (err) {
                            done(err, user.username);
                        }
                    );
                }
            ], function(err, user) {
                if (err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, {
                        mailto: user
                    });
                }
            });
        });

    app.use('/apiGloballyShared', router);
};