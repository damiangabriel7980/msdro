var mongoose = require('mongoose');
var User = require('./models/user');
var Roles=require('./models/roles');
var jwt = require('jsonwebtoken');
var XRegExp  = require('xregexp').XRegExp;
var validator = require('validator');
var crypto   = require('crypto');
var expressJwt = require('express-jwt');
var async = require('async');

var Cities = require('./models/cities');
var Therapeutic_Area = require('./models/therapeutic_areas');
var Counties = require('./models/counties');
var Job = require('./models/jobs');


module.exports = function(app, mandrill, logger, tokenSecret, pushServerAddr, router) {

    //returns user data (parsed from token found on the request)
    var getUserData = function (req) {
        var token;
        try{
            token = req.headers.authorization.split(' ').pop();
        }catch(ex){
            token = null;
        }
        return token?jwt.decode(token):{};
    };

    //access control allow origin *
    app.all("/apiMobileShared/*", function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
        next();
    });

    // We are going to protect /apiMobileShared routes with JWT
    app.use('/apiMobileShared', expressJwt({secret: tokenSecret}).unless({path: ['/apiMobileShared/createAccount', '/apiMobileShared/resetPass']}));

//===================================================================================================================== create account
    router.route('/createAccount')
        .post(function (req, res) {
            var namePatt = new XRegExp('^[a-zA-Z\\s]{3,100}$');

            var name = req.body.name?req.body.name:"";
            var email = req.body.email?req.body.email:"";
            var password = req.body.password?req.body.password:"";
            var confirm = req.body.confirm?req.body.confirm:"";

            var info = {error: true, type:"danger"};

            //validate data
            if(!validator.isEmail(email)){
                info.message = "Adresa de e-mail nu este valida";
                res.json(info);
            }else if(!namePatt.test(name.replace(/ /g,''))){
                info.message = "Numele trebuie sa contina doar litere, minim 3";
                res.json(info);
            }else if(password.length < 6 || password.length > 32){
                info.message = "Parola trebuie sa contina intre 6 si 32 de caractere";
                res.json(info);
            }else if(password !== confirm){
                info.message = "Parolele nu corespund";
                res.json(info);
            }else{
                //data is valid
                User.findOne({username: email}, function(err, user) {
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
                                                //send email
                                                mandrill({from: 'adminMSD@qualitance.ro',
                                                    to: [inserted.username],
                                                    subject:'Activare cont MSD',
                                                    text: 'Ati primit acest email deoarece v-ati inregistrat pe MSD.\n\n' +
                                                        'Va rugam accesati link-ul de mai jos (sau copiati link-ul in browser) pentru a va activa contul:\n\n' +
                                                        'http://' + req.headers.host + '/activateAccount/' + inserted.activationToken + '\n\n' +
                                                        'Link-ul este valabil maxim o ora\n'+
                                                        'Daca nu v-ati creat cont pe MSD, va rugam sa ignorati acest e-mail\n'
                                                }, function(errm){
                                                    if(errm) {
                                                        logger.error(errm);
                                                        res.send(errm);
                                                    }else{
                                                        info.error = false;
                                                        info.type = "success";
                                                        info.message = "Un email de activare a fost trimis";
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

//============================================================================================= generate token for resetting user password
    router.route('/resetPass')
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
                    User.findOne({ username: req.body.email }, function(err, user) {
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

    /*

    //=============================================================================================================== change password

    router.route('/changePassword')
        .post(function (req, res) {
            var ans = {error: true, message:"Server error"};
            var userData = req.body.userData;
            //check if password is correct
            if(SHA256(userData.oldPass).toString() !== req.user.password){
                ans.error = true;
                ans.message = "Parola nu este corecta";
                res.json(ans);
            }else{
                //check if new password length is valid
                if(userData.newPass.toString().length < 6 || userData.newPass.toString.length > 32){
                    ans.error = true;
                    ans.message = "Parola noua trebuie sa contina intre 6 si 32 de caractere";
                    res.json(ans);
                }else{
                    //check if passwords match
                    if(userData.newPass !== userData.confirmPass){
                        ans.error = true;
                        ans.message = "Parolele nu corespund";
                        res.json(ans);
                    }else{
                        //change password
                        var upd = User.update({_id:req.user._id}, {password: SHA256(userData.newPass).toString()}, function () {
                            if(!upd._castError){
                                ans.error = false;
                                ans.message = "Parola a fost schimbata";
                                res.json(ans);
                            }else{
                                ans.error = true;
                                ans.message = "Eroare la schimbarea parolei";
                                res.json(ans);
                            }
                        });
                    }
                }
            }
        });

    //===================================================================================================================== change email

    router.route('/changeEmail')
        .post(function (req, res) {
            var ans = {error: true, message:"Server error"};
            var userData = req.body.userData;
            //check if mail is valid
            var mailPatt = new XRegExp('^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$', 'i');
            if(!mailPatt.test(userData.mail.toString())){
                ans.error = true;
                ans.message = "E-mail invalid";
                res.json(ans);
            }else{
                //check if mail already exists
                User.find({username: userData.mail}, function(err, result){
                    if(err){
                        ans.error = true;
                        ans.message = "Eroare la schimbarea adresei de e-mail";
                        res.json(ans);
                    }else{
                        if(result.length == 0){
                            //check password
                            if(SHA256(userData.pass).toString() === req.user.password){
                                var upd = User.update({_id:req.user._id}, {username: userData.mail}, function () {
                                    if(!upd._castError){
                                        ans.error = false;
                                        ans.message = "Adresa de e-mail a fost modificata";
                                        res.json(ans);
                                    }else{
                                        ans.error = true;
                                        ans.message = "Eroare la schimbarea adresei de e-mail";
                                        res.json(ans);
                                    }
                                });
                            }else{
                                ans.error = true;
                                ans.message = "Parola incorecta";
                                res.json(ans);
                            }
                        }else{
                            ans.error = true;
                            ans.message = "Acest e-mail este deja folosit";
                            res.json(ans);
                        }
                    }
                });
            }
        });

    //============================================================================================================= user job

    router.route('/userJob')

        .post(function (req, res) {
            var ans = {error:false};
            var job = req.body.job;
            var namePatt = new XRegExp('^[a-zA-Z\\s]{3,30}$');
            var numberPatt = new XRegExp('^[0-9]{1,5}$');
            if(!numberPatt.test(job.street_number.toString())) {
                ans.error = true;
                ans.message = "Numarul strazii trebuie sa contina intre 1 si 5 cifre";
            }
            if(!namePatt.test(job.street_name.toString())) {
                ans.error = true;
                ans.message = "Numele strazii trebuie sa contina doar litere, minim 3";
            }
            if(!namePatt.test(job.job_name.toString())) {
                ans.error = true;
                ans.message = "Locul de munca trebuie sa contina doar litere, minim 3";
            }
            if(!isNaN(parseInt(job.job_type))){
                if(parseInt(job.job_type)<1 || parseInt(job.job_type>4)){
                    ans.error = true;
                    ans.message = "Selectati un tip de loc de munca";
                }
            }else{
                ans.error = true;
                ans.message = "Selectati un tip de loc de munca";
            }
            if(ans.error){
                res.json(ans);
            }else{
                if(job._id==0){
                    //create new
                    var newJob = new Job({
                        job_type: job.job_type,
                        job_name: job.job_name,
                        street_name: job.street_name,
                        street_number: job.street_number,
                        postal_code: job.postal_code,
                        job_address: job.job_address
                    });
                    newJob.save(function (err, inserted) {
                        if(err){
                            ans.error = true;
                            ans.message = "Eroare la crearea locului de munca. Va rugam verificati campurile";
                            res.json(ans);
                        }else{
                            //update user to point to new job
                            var idInserted = inserted._id.toString();
                            var upd = User.update({_id:req.user._id}, {jobsID: [idInserted]}, function () {
                                if(!upd._castError){
                                    ans.error = false;
                                    ans.message = "Locul de munca a fost salvat";
                                }else{
                                    ans.error = true;
                                    ans.message = "Eroare la adaugarea locului de munca. Va rugam sa verificati datele";
                                }
                                res.json(ans);
                            });
                        }
                    });
                }else{
                    //update existing
                    var upd = Job.update({_id:job._id}, {
                        job_type: job.job_type,
                        job_name: job.job_name,
                        street_name: job.street_name,
                        street_number: job.street_number,
                        postal_code: job.postal_code,
                        job_address: job.job_address
                    }, function () {
                        if(!upd._castError){
                            ans.error = false;
                            ans.message = "Locul de munca a fost adaugat";
                        }else{
                            ans.error = true;
                            ans.message = "Eroare la adaugarea locului de munca. Va rugam sa verificati datele";
                        }
                        res.json(ans);
                    });
                }
            }
        });

    //======================================================================================================= get cities, counties, therapeutic areas

    router.route('/therapeutic_areas')

        .get(function(req, res) {
            Therapeutic_Area.find({$query:{}, $orderby: {name: 1}}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });
        });
    router.route('/counties')

        .get(function(req, res) {
            Counties.find({$query:{}, $orderby: {name: 1}}, {name: 1}, function (err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/cities/:county_name')

        .get(function(req, res) {
            Counties.find({name: req.params.county_name}, function (err, counties) {
                if(err) {
                    res.send(err);
                }
                Cities.find({_id: {$in: counties[0].citiesID}}, function (err, cities) {
                    if(err) {
                        res.send(err);
                    }
                    res.json(cities);
                });
            });
        });

    */

//========================================================================================================== route for retrieving user's profile info
    router.route('/userProfile')
        .get(function (req, res) {
            res.json(getUserData(req));
        });

    app.use('/apiMobileShared', router);
};