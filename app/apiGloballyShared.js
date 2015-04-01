var User = require('./models/user');
var UserGroup = require('./models/userGroup');
var ActivationCodes =require('./models/activationCodes');
var Roles=require('./models/roles');

var mongoose = require('mongoose');
var XRegExp  = require('xregexp').XRegExp;
var validator = require('validator');
var crypto   = require('crypto');
var async = require('async');
var SHA512   = require('crypto-js/sha512');

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

module.exports = function(app, mandrill, logger, amazon, router) {

    //access control allow origin *
    app.all("/apiGloballyShared/*", function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
        next();
    });

    // middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        console.log("check login");
        if (req.isAuthenticated()){
            return next();
        }else{
            res.status(403).end();
        }
    }

    //trim every keys except the ones specified in the "fields" array
    var trimObject = function (obj, fields) {
        if(typeof obj !== "object") obj = {};
        if(typeof fields !== "object") fields = [];
        if(fields.constructor.toString().indexOf("Array") == -1) fields = [];
        try{
            var ret = {};
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    if(fields.indexOf(key) > -1){
                        ret[key] = obj[key];
                    }
                }
            }
            return ret;
        }catch(ex){
            return {};
        }
    };

//===================================================================================================================== create account

    var validateCreateAccount = function (req, res, next) {
        var namePatt = new XRegExp('^[a-zA-Z]{3,100}$');

        var title = req.body.title?req.body.title:"";
        var name = req.body.name?req.body.name:"";
        var email = req.body.email?req.body.email:"";
        var password = req.body.password?req.body.password:"";

        var info = {error: true, type:"danger"};

        console.log(name.replace(/ /g,'').replace(/-/g,'').replace(/\./g,''));
        //validate data
        if(!validator.isEmail(email)){
            info.message = "Adresa de e-mail nu este valida";
            res.json(info);
        }else if(typeof title !== "number"){
            info.message = "Titlul este obligatoriu";
            res.json(info);
        }else if(!namePatt.test(name.replace(/ /g,'').replace(/-/g,'').replace(/\./g,''))){
            info.message = "Numele trebuie sa contina minim 3 litere si doar caracterele speciale '-', '.'";
            res.json(info);
        }else if(password.length < 6 || password.length > 32){
            info.message = "Parola trebuie sa contina intre 6 si 32 de caractere";
            res.json(info);
        }else{
            User.findOne({username: {$regex: "^"+email.replace(/\+/g,"\\+")+"$", $options: "i"}}, function(err, user) {
                //if there are any errors, return the error
                if(err){
                    logger.error(err);
                    info.message = "A aparut o eroare pe server";
                    res.json(info);
                }else if(user) {
                    // check to see if there's already a user with that email
                    info.message = "Acest e-mail este deja folosit";
                    res.send(info);
                }else{
                    //data is valid
                    req.staywellUser = {
                        title: title,
                        name: name,
                        username: email,
                        password: new User().generateHash(password),
                        state: "PENDING",
                        account_expired: false,
                        account_locked: false,
                        enabled: false,
                        created: Date.now(),
                        last_updated: Date.now()
                    };
                    next();
                }
            });
        }
    };

    var validateCompleteProfile = function (req, res, next) {
        var staywellUser = req.staywellUser || {};

        var info = {error: true, type:"danger"};
        try{
            var activation = req.body.activation || {};
            //make sure only the info provided in the form is updated
            var userData = trimObject(req.body.user, ['profession','groupsID','practiceType','address','citiesID','phone','subscriptions']);
            userData.groupsID = userData.groupsID || [];

            if(activation.type !== "code" && activation.type !== "file"){
                info.message = "Tipul de activare nu este valid";
                res.json(info);
            }else if(activation.type === "file" && !(activation.value.extension && activation.value.file)){
                info.message = "Eroare la citirea fisierului";
                res.json(info);
            }else if(activation.type === "code" && !activation.value){
                info.message = "Eroare la citirea codului";
                res.json(info);
            }else if(!userData.profession){
                info.message = "Profesia este obligatorie";
                res.json(info);
            }else if(!userData.groupsID[0]){
                info.message = "Selectati un grup preferat";
                res.json(info);
            }else if(!userData.citiesID){
                info.message = "Selectati un oras";
                res.json(info);
            }else{
                //establish default user group
                UserGroup.findOne({profession: userData.profession, display_name: "Default"}, function (err, group) {
                    if(err || !group){
                        logger.error(err);
                        info.message = "A aparut o eroare pe server";
                        res.json(info);
                    }else{
                        //establish groups ids
                        userData.groupsID.push(group._id.toString());
                        //validate activation code / proof
                        if(activation.type === "code"){
                            //validate code
                            ActivationCodes.findOne({profession: userData.profession}).select('+value').exec(function (err, code) {
                                if(err || !code){
                                    logger.error(err);
                                    info.message = "A aparut o eroare pe server";
                                    res.json(info);
                                }else{
                                    if(SHA512(activation.value).toString() !== code.value){
                                        info.message = "Codul de activare nu este valid";
                                        res.json(info);
                                    }else{
                                        staywellUser.state = "ACCEPTED";
                                        req.staywellUser = mergeKeys(staywellUser, userData);
                                        next();
                                    }
                                }
                            });
                        }else{
                            //validate proof
                            if(typeof activation.value.extension === "string" && typeof activation.value.file === "string"){
                                staywellUser.state = "PENDING";
                                req.staywellUser = mergeKeys(staywellUser, userData);
                                req.staywellProof = activation.value;
                                next();
                            }else{
                                info.message = "Dovada nu a putut fi incarcata";
                                res.json(info);
                            }
                        }
                    }
                });
            }
        }catch(ex){
            info.message = "A aparut o eroare pe server";
            res.json(info);
        }
    };

    var uploadProof = function (req, res, next) {
        var info = {error: true, type:"danger"};

        var staywellUser = req.staywellUser || {};
        var userEmail = staywellUser.username || req.user.username;

        var staywellProof = req.staywellProof;

        if(staywellUser.state === "ACCEPTED"){
            next();
        }else if(!staywellProof){
            info.message = "A aparut o eroare la incarcarea dovezii";
            res.json(info);
        }else if(!userEmail){
            info.message = "A aparut o eroare la incarcarea dovezii";
            res.json(info);
        }else{
            User.findOne({username: {$regex: "^"+userEmail.replace(/\+/g,"\\+")+"$", $options: "i"}}).exec(function (err, user) {
                if(err || !user){
                    logger.error(err);
                    info.message = "A aparut o eroare la incarcarea dovezii";
                    res.json(info);
                }else{
                    var key = "user/"+user._id+"/proof."+staywellProof.extension;
                    amazon.addObjectS3(key, staywellProof.file, function (err) {
                        if (err){
                            logger.error(err);
                            info.message = "Dovada nu a putut fi incarcata";
                            res.json(info);
                        }else{
                            User.update({_id: user._id}, {$set: {proof_path: key}}, function (err, wres) {
                                if(err){
                                    logger.error(err);
                                    info.message = "A aparut o eroare la incarcarea dovezii";
                                    res.json(info);
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
        var info = {error: true, type:"danger"};

        var user = new User(req.staywellUser);
        user.save(function (err, saved) {
            if(err){
                logger.error(err);
                info.message = "A aparut o eroare la salvarea datelor";
                res.json(info);
            }else{
                next();
            }
        });
    };

    var completeProfile = function (req, res, next) {
        var info = {error: true, type:"danger"};

        User.update({_id: req.user._id}, {$set: req.staywellUser}, function (err, wres) {
            if(err){
                logger.error(err);
                info.message = "A aparut o eroare la salvarea datelor";
                res.json(info);
            }else{
                next();
            }
        });
    };

    router.route('/createAccountStaywell')
        .post(validateCreateAccount, validateCompleteProfile, createAccount, uploadProof, function (req, res) {
            var info = {
                error: false,
                type: "success",
                user: req.staywellUser.username,
                state: req.staywellUser.state
            };
            res.send(info);
        });

    router.route('/completeProfile')
        .post(isLoggedIn, validateCompleteProfile, completeProfile, uploadProof, function (req,res) {
            var info = {
                error: false,
                type: "success",
                user: req.user.username,
                state: req.staywellUser.state
            };
            res.send(info);
        });

    router.route('/createAccountMobile')
        .post(validateCreateAccount, createAccount, function (req, res) {
            var info = {
                error: false,
                type: "success",
                user: req.staywellUser.username,
                state: req.staywellUser.state
            };
            res.json(info);
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
                    User.findOne({ username: {$regex: "^"+req.body.email.replace(/\+/g,"\\+")+"$", $options: "i"} }, function(err, user) {
                        if (!user) {
                            res.send({message : {hasError: true, text: 'Nu a fost gasit un cont pentru acest e-mail.'}});
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
                    mandrill({from: 'adminMSD@qualitance.ro',
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
                    res.send({message : {hasError: true, text: 'A aparut o eroare. Va rugam verificati datele'}});
                }else{
                    res.send({message : {hasError: false, text: 'Un email cu instructiuni a fost trimis catre ' + user + '.', type: 'info'}});
                }
            });
        });

    app.use('/apiGloballyShared', router);
};