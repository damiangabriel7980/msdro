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


module.exports = function(app, mandrill, logger, router) {

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
    router.route('/createAccount')
        .post(function (req, res) {
            var namePatt = new XRegExp('^[a-zA-Z]{3,100}$');

            var title = req.body.title?req.body.title:"";
            var name = req.body.name?req.body.name:"";
            var email = req.body.email?req.body.email:"";
            var password = req.body.password?req.body.password:"";
            var createdFromStaywell = req.body.createdFromStaywell?true:false;

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
                //data is valid
                User.findOne({username: {$regex: "^"+email.replace(/\+/g,"\\+")+"$", $options: "i"}}, function(err, user) {
                    // if there are any errors, return the error
                    if (err){
                        res.json(err);
                    }else if (user) {
                        // check to see if there's already a user with that email
                        info.message = "Acest e-mail este deja folosit";
                        res.send(info);
                    } else {
                        // create the user
                        var newUser = new User();

                        //get default role
                        Roles.findOne({'authority': 'ROLE_FARMACIST'}, function (err, role) {
                            if(err){
                                res.send(err);
                            }else{
                                newUser.rolesID = [role._id.toString()];
                                newUser.username = email;
                                newUser.name     = name;
                                newUser.password = newUser.generateHash(password);
                                newUser.password_expired = false;
                                newUser.account_expired = false;
                                newUser.account_locked = false;
                                newUser.enabled = false; //enable only after email activation
                                newUser.last_updated = Date.now();
                                newUser.state = "PENDING";
                                newUser.phone="";
                                newUser.birthday=null;
                                newUser.description="";
                                newUser.jobsID=[];
                                newUser.title = title;
                                //set activation token
                                crypto.randomBytes(40, function(err, buf) {
                                    if(err){
                                        res.send(err);
                                    }else{
                                        newUser.activationToken = buf.toString('hex');

                                        //save user
                                        newUser.save(function(err, inserted) {
                                            if (err){
                                                res.send(err);
                                            }else{
                                                //we need to email the user
                                                //first, create an activation link
                                                var activationLink;
                                                //if the account was created from Staywell site, create a special link
                                                if(createdFromStaywell){
                                                    activationLink = 'http://' + req.headers.host + '/activateAccountStaywell/' + inserted.activationToken;
                                                }else{
                                                    activationLink = 'http://' + req.headers.host + '/activateAccount/' + inserted.activationToken;
                                                }
                                                mandrill({from: 'adminMSD@qualitance.ro',
                                                    to: [inserted.username],
                                                    subject:'Activare cont MSD',
                                                    text:
                                                        'Draga '+inserted.name+',\n\n\n'+
                                                        'Ati primit acest email deoarece v-ati inregistrat pe MSD.\n\n' +
                                                        'Va rugam accesati link-ul de mai jos (sau copiati link-ul in browser) pentru validarea adresei de e-mail:\n\n' +
                                                        activationLink + '\n\n' +
                                                        'Daca nu v-ati creat cont pe MSD, va rugam sa ignorati acest e-mail\n\n\n'+
                                                        'Toate cele bune,\nAdmin MSD'
                                                }, function(errm){
                                                    if(errm) {
                                                        logger.error(errm);
                                                        res.send(errm);
                                                    }else{
                                                        info.error = false;
                                                        info.type = "success";
                                                        info.message = "Un email de verificare a fost trimis";
                                                        info.user = email;
                                                        res.json(info);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

    router.route('/accountActivation/completeProfile')
        .post(isLoggedIn, function(req,res){
            var activationCode = req.body.activationCode;
            //make sure only the info provided in the form is updated
            var userData = trimObject(req.body.user, ['profession','groupsID','practiceType','address','citiesID','phone','subscriptions']);

            User.findOne({_id: req.user._id}).exec(function (err, user) {
                if(err || !user){
                    logger.error(err);
                    res.send({error: "A aparut o eroare pe server"});
                }else{
                    //establish default user group
                    UserGroup.findOne({profession: userData.profession, display_name: "Default"}, function (err, group) {
                        if(err || !group){
                            logger.error(err);
                            res.send({error: "A aparut o eroare pe server"});
                        }else{
                            if(!userData.groupsID) userData.groupsID = [];
                            userData.groupsID.push(group._id.toString());
                            //validate activation code
                            ActivationCodes.findOne({profession: userData.profession}).select('+value').exec(function (err, code) {
                                if(err || !code){
                                    logger.error(err);
                                    res.send({error: "A aparut o eroare pe server"});
                                }else{
                                    //validate code
                                    if(SHA512(activationCode).toString() !== code.value){
                                        res.send({error: "Codul de activare nu este valid"});
                                    }else{
                                        userData.state = "ACCEPTED";
                                        User.update({_id: user._id},{$set: userData},function (err) {
                                            if (err){
                                                logger.error(err);
                                                res.send({error: "A aparut o eroare pe server"});
                                            }else{
                                                //all done. user is activated and profile completed
                                                res.send({success: true});
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
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