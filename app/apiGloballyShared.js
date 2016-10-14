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

var mongoose = require('mongoose');
var validator = require('validator');
var crypto   = require('crypto');
var async = require('async');
var SHA512   = require('crypto-js/sha512');

var MailerModule = require('./modules/mailer');
var UtilsModule = require('./modules/utils');

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
    /**
     * @apiName Retrieve_Amazon_Bucket
     * @apiDescription Retrieve Amazon Bucket
     * @apiGroup Global_API
     * @api {get} /apiGloballyShared/appSettings/ Retrieve Amazon Bucket
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiExample {curl} Example usage:
     *     curl -i -H "Authorization: Bearer " http://localhost:8080/apiGloballyShared/appSettings
     * @apiSuccess {Object} response.success an object containing the link to the Amazon bucket
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *          amazonPrefix: ''
     *        },
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
            UtilsModule.allowFields(req.body.user, ['profession','groupsID','practiceType','address','citiesID','phone','subscriptions','specialty','job']);
            var userData = req.body.user;
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
                                        Divisions.findOne({code: SHA512(activation.value).toString()}).exec(function (err, division) {
                                            if(err || !division){
                                                handleError(res ,null, 400, 351);
                                            }else{
                                                if(!activation.value || (SHA512(activation.value).toString() !== division.code)){
                                                    handleError(res, null, 403, 351);
                                                }else{
                                                    staywellUser.division = division;
                                                    staywellUser.state = "ACCEPTED";
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

    /**
     * @apiName Create_Staywell_Account
     * @apiDescription Create a Staywell account
     * @apiGroup Global_API
     * @api {post} /apiGloballyShared/createAccountStaywell/ Create a Staywell account
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {Object} user a user object containing the following properties:
     *   title, name, email, password, registeredFrom, job, profession,
     *   groupsID, address, citiesID, practiceType, phone, subscriptions, specialty
     * @apiParam {Object} activation Contains the properties : type - can be 'code' or 'file' and value - can be file or code string
     * @apiExample {curl} Example usage:
     *     curl -i -x POST -H "Authorization: Bearer " -d '{user: {}, activation: {}}' http://localhost:8080/apiGloballyShared/createAccountStaywell
     * @apiSuccess {Object} response.success an object containing the current state of the user and the username
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *             user: '',
     *             state: ''
     *        },
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse BadRequest
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 400 BadRequest Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/createAccountStaywell')
        .post(validateCreateAccount, validateCompleteProfile, createAccount, uploadProof, function (req, res) {
            var info = {
                error: false,
                type: "success",
                user: req.staywellUser.username,
                state: req.staywellUser.state
            };
            handleSuccess(res, info);
            notifyAdmin(req.staywellUser._id);

            if(req.staywellUser.state === "ACCEPTED"){
                generateToken(req.staywellUser.username, function (err, activationToken) {
                    var activationLink = activationPrefixStaywell(req.headers.host) + activationToken;
                    var emailTo = [{email: req.staywellUser.username, name: req.staywellUser.name}];

                    MailerModule.send(
                        "Staywell_createdAccount",
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
                        'Activare cont MSD'
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
        });

    /**
     * @apiName Complete_Staywell_Account
     * @apiDescription Complete Staywell account
     * @apiGroup Global_API
     * @api {post} /apiGloballyShared/completeProfile/ Complete Staywell account
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {Object} user a user object containing the following properties:
     *   title, name, email, password, registeredFrom, job, profession,
     *   groupsID, address, citiesID, practiceType, phone, subscriptions, specialty
     * @apiParam {Object} activation Contains the properties : type - can be 'code' or 'file' and value - can be file or code string
     * @apiExample {curl} Example usage:
     *     curl -i -x POST -H "Authorization: Bearer " -d '{user: {}, activation: {}}' http://localhost:8080/apiGloballyShared/completeProfile
     * @apiSuccess {Object} response.success an object containing the current state of the user and the username
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *              user: '',
     *              state: ''
     *        },
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse BadRequest
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 400 BadRequest Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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

    /**
     * @apiName Create_Staywell_Account_Mobile
     * @apiDescription Create a Staywell account (mobile only)
     * @apiGroup Global_API
     * @api {post} /apiGloballyShared/createAccountMobile/ Create a Staywell account (mobile only)
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {Object} user a user object containing the following properties:
     *   title, name, email, password, registeredFrom, job
     * @apiExample {curl} Example usage:
     *     curl -i -x POST -H "Authorization: Bearer " -d '{user: {}}' http://localhost:8080/apiGloballyShared/createAccountMobile
     * @apiSuccess {Object} response.success an object containing the current state of the user and the username
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *              user: '',
     *              state: ''
     *        },
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse BadRequest
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 400 BadRequest Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
                        "Staywell_createdAccountMobile",
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
                        'Activare cont MSD'
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

    /**
     * @apiName Retrieve_Professions
     * @apiDescription Retrieve a list of professions
     * @apiGroup Global_API
     * @api {get} /apiGloballyShared/accountActivation/professions Retrieve a list of professions
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiExample {curl} Example usage:
     *     curl -i -H "Authorization: Bearer " http://localhost:8080/apiGloballyShared/accountActivation/professions
     * @apiSuccess {Array} response.success an array of professions
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Retrieve_specialties
     * @apiDescription Retrieve a list of specialties
     * @apiGroup Global_API
     * @api {get} /apiGloballyShared/accountActivation/specialty Retrieve a list of specialties
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiExample {curl} Example usage:
     *     curl -i -H "Authorization: Bearer " http://localhost:8080/apiGloballyShared/accountActivation/specialty
     * @apiSuccess {Array} response.success an array of specialties
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Retrieve_groups
     * @apiDescription Retrieve a list of groups based on profession
     * @apiGroup Global_API
     * @api {get} /apiGloballyShared/accountActivation/signupGroups/:profession Retrieve a list of groups based on profession
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {String} profession The id of the profession
     * @apiExample {curl} Example usage:
     *     curl -i -H "Authorization: Bearer " http://localhost:8080/apiGloballyShared/accountActivation/signupGroups/215r25fqfwfdf2
     * @apiSuccess {Array} response.success an array of groups
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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

    /**
     * @apiName Retrieve_counties
     * @apiDescription Retrieve a list of counties
     * @apiGroup Global_API
     * @api {get} /apiGloballyShared/accountActivation/specialty Retrieve a list of counties
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiExample {curl} Example usage:
     *     curl -i -H "Authorization: Bearer " http://localhost:8080/apiGloballyShared/accountActivation/counties
     * @apiSuccess {Array} response.success an array of counties
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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

    /**
     * @apiName Retrieve_cities
     * @apiDescription Retrieve a list of cities from a county
     * @apiGroup Global_API
     * @api {get} /apiGloballyShared/accountActivation/cities Retrieve a list of cities from a county
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {String} county the id of the county
     * @apiExample {curl} Example usage:
     *     curl -i -H "Authorization: Bearer " http://localhost:8080/apiGloballyShared/accountActivation/cities
     * @apiSuccess {Array} response.success an array of cities
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Request_Password_Reset
     * @apiDescription Request password reset
     * @apiGroup Global_API
     * @api {post} /apiGloballyShared/requestPasswordReset Request password reset
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {String} email the user's email
     * @apiExample {curl} Example usage:
     *     curl -i -x POST -H "Authorization: Bearer " -d '{email : ''}' http://localhost:8080/apiGloballyShared/requestPasswordReset
     * @apiSuccess {Object} response.success an object containing the email the reset password email was sent to
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *          mailto: ''
     *        },
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse BadRequest
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 400 BadRequest Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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

                    MailerModule.send(
                        "Staywell_requestedReset",
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
                        'Resetare parola MSD'
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