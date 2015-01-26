/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose = require('mongoose');
var User = require('./models/user');
var jwt = require('jsonwebtoken');
var XRegExp  = require('xregexp').XRegExp;
var validator = require('validator');
var crypto   = require('crypto');
var expressJwt = require('express-jwt');
var async = require('async');
var NewsPost = require('./models/newspost');
var chatDoc= require('./models/chatDoc');
var MessagesDoc= require('./models/messagesDoc');
var request = require('request');
var fs = require('fs');
var Roles=require('./models/roles');
var Counties = require('./models/counties');
var Job = require('./models/jobs');
var Cities = require('./models/cities');
var Therapeutic_Area = require('./models/therapeutic_areas');
var url = require('url');
//configure credentials for use on server only; assign credentials based on role (never use master credentials)


module.exports = function(app, logger, tokenSecret, router) {

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
    //================================================================================================================= functions for getting data in depth

    //================================================================================================= access control and route protection
    //access control allow origin *
    app.all("/apiMSDDoc/*", function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
        next();
    });

    // We are going to protect /apiConferences routes with JWT
    app.use('/apiMSDDoc', expressJwt({secret: tokenSecret}).unless({path: ['/apiMSDDoc/createAccount', '/apiMSDDoc/resetPass']}));

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
                                                    text: 'Ati primit acest email deoarece v-ati inregistrat pe MSD Check-in.\n\n' +
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

    //generate token for resetting user password
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

    //route for retrieving user's profile info
    router.route('/userProfile')
        .get(function (req, res) {
            res.json(getUserData(req));
        });



      //==================================================================================================================== all routes


    //========get News by Different Parameters=======//
    router.route('/newsPost')
        .get(function(req,res){
            console.log(req.query);
            if(req.query.id){
                var id=req.query.id;
                chatDoc.findOne({post_id: id}).populate('message_ids',{ sort: { 'last_updated': 1 } }).populate('post_id').populate('chat_receiver chat_sender').exec(function(err,result){
                    if(err)
                        res.json(err);
                    else
                        res.json(result);
                })
            }else if(req.query.pageSize){
                var pageSize=req.query.pageSize;
                var timestamp = req.query.timestamp;
                var q = {};
                if(timestamp){
                    q['last_updated'] = {$lt: new Date(timestamp)};
                }
                NewsPost.find(q).sort({'last_updated' : -1}).limit(pageSize)
                    .exec(function(err, result) {
                        if(err)
                            res.json(err);
                        else
                            res.json(result);
                    });
            } else {
                res.send({hasError: true, text: "Invalid params"});
            }
        })
    .post(function(req,res){
        var MyNewsPost = new NewsPost();
        MyNewsPost.title=req.body.title;
        MyNewsPost.message=req.body.message;
        MyNewsPost.last_updated= Date.now();
//        if(req.body.imageSerialized)
//            MyNewsPost.image_path=req.body.imageSerialized;
//        else
//            MyNewsPost.image_path="";
        MyNewsPost.save(function(err,saved){
            if(err)
                res.json(err);
            else
            {
                res.send({status:200, saved: saved});

            }
        })
    });

    //========get Medics paginated=======//

    router.route('/getMedics/:pageSize')
        .get(function(req,res){
            var pageSize = req.params.pageSize;
            User.find({visible:true},'name username birthday phone description').sort({'last_updated': -1}).limit(pageSize)
                .exec(function(err, result) {
                    if(err)
                        res.json(err);
                    else
                        res.json(result);
                });
        });
    router.route('/getMedicsPaginated/:pageSize/:skip')
        .get(function(req,res){
            var pageSize = req.params.pageSize;
            var skipMedics = req.params.skip;
            console.log(pageSize);
            console.log(skipMedics);
            User.find({visible:true},'name username birthday phone description').sort({'last_updated': -1}).skip(skipMedics).limit(pageSize)
                .exec(function(err, result) {
                    if(err)
                        res.json(err);
                    else
                        res.json(result);
                });
        });
    router.route('/getMedics/:id')
        .get(function(req,res){
            var id = req.params.id;
            User.findOne({_id: id},'name username birthday phone description').populate('jobsID').exec(function(err, result) {
                    if(err)
                        res.json(err);
                    else
                        res.json(result);
                });
        });







    router.route('/getMyProfile/:id')
        .get(function(req,res){
            var id = req.params.id;
            var user = req.user;
            var userCopy = {};
            userCopy['id']=user._id;
            userCopy['name'] = user.name;
            userCopy['image_path'] = user.image_path;
            userCopy['phone'] = user.phone;
            userCopy['points'] = user.points;
            userCopy['birthday'] = user.birthday;
            userCopy['description'] = user.description;
            userCopy['subscription'] = user.subscription;
            userCopy['username'] = user.username;
            userCopy['therapeutic-areasID'] = user['therapeutic-areasID'];
            userCopy['citiesID'] = user.citiesID;
            async.parallel([
                function (callback) {
                    if(user['jobsID']){
                        if(user['jobsID'][0]){
                            var jobId = user.jobsID[0];
                            Job.find({_id:jobId}, function (err, job) {
                                if(err){
                                    callback(err, null);
                                }else{
                                    userCopy.job = job;
                                }
                            });
                        }
                    }
                    callback(null, null);
                },
                function (callback) {
                    Cities.find({_id:user.citiesID[0]}, function (err, city) {
                        if (err) {
                            callback(err, null);
                        }
                        if (city[0]) {
                            Counties.find({citiesID: {$in: [city[0]._id.toString()]}}, function (err, county) {
                                if(err){
                                    callback(err, null);
                                }
                                if(county[0]){
                                    userCopy['city_id'] = city[0]._id;
                                    userCopy['city_name'] = city[0].name;
                                    userCopy['county_id'] = county[0]._id;
                                    userCopy['county_name'] = county[0].name;
                                }
                                callback(null, null);
                            });
                        }else{
                            callback(null, null);
                        }
                    });
                }
            ], function (err, results) {
                if(err){
                    console.log(err);
                    res.send(err);
                }else{
                    console.log(userCopy);
                    res.json(userCopy);
                }
            });
        });



    //========Update my Profile=======//

    router.route('/userProfile')

        .post(function (req, res) {
            var ans = {};
            var newData = req.body.newData;
            var namePatt = new XRegExp('^[a-zA-Z\\s]{3,100}$');
            var phonePatt = new XRegExp('^[0-9]{10,20}$');
            //check name
            if((!namePatt.test(newData.firstName.toString())) || (!namePatt.test(newData.lastName.toString()))){
                ans.error = true;
                ans.message = "Numele si prenumele trebuie sa contina doar caractere, minim 3";
                res.json(ans);
            }else{
                //check phone number
                if(!phonePatt.test(newData.phone.toString())){
                    ans.error = true;
                    ans.message = "Numarul de telefon trebuie sa contina doar cifre, minim 10";
                    res.json(ans);
                }else{
                    var serializedAreas = [];
                    for(var i=0; i<newData.therapeuticAreas.length; i++){
                        serializedAreas.push(newData.therapeuticAreas[i].id.toString());
                    }
                    var upd = User.update({_id:req.user._id}, {
                        name: newData.firstName+" "+newData.lastName,
                        phone: newData.phone,
                        birthday: newData.birthday,
                        description: newData.description,
                        subscription: newData.newsletter?1:0,
                        "therapeutic-areasID": serializedAreas,
                        citiesID: [newData.city]
                    }, function () {
                        if(!upd._castError){
                            ans.error = false;
                            ans.message = "Datele au fost modificate";
                        }else{
                            ans.error = true;
                            ans.message = "Eroare la actualizare. Verificati datele";
                        }
                        res.json(ans);
                    });
                }
            }
        });
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





    //========Get messages by topic/conversations=======//


    router.route('/getMessagesByTopics')
        .get(function(req,res){
            var id = req.user._id;
            chatDoc.find({post_id: {'$ne': null },chat_sender: id}).populate('post_id').exec(function(err, result) {
                if(err)
                    res.json(err);
                else
                    res.json(result);
            });
        });

    router.route('/getMessagesByTopicsForPost/:timestamp/:pageSize/:postID')
        .get(function(req,res){
            var id = req.user._id;
            var timestamp=req.params.timestamp;
            var pagesize=req.params.pageSize;
            var postID= req.params.postID;
            chatDoc.find({post_id: postID}).populate({path:'message_ids',options:{ sort: { 'last_updated': -1 },last_updated: {$lt: timestamp},limit: pagesize }}).populate('post_id').exec(function(err, result) {
                if(err)
                    res.json(err);
                else
                    res.json(result);
            });
        });


    router.route('/getGeneralMessages/:timestamp/:pageSize')
        .get(function(req,res){
            var id = req.user._id;
            var timestamp=req.params.timestamp;
            var pagesize=req.params.pageSize;
            chatDoc.find({post_id: null,chat_sender: req.user._id}).populate({path: "message_ids", options: {sort: { 'last_updated': -1 },last_updated: {"$lt": timestamp},limit: pagesize} }).exec(function(err, result) {
                if(err)
                {
                    console.log(err);
                    res.json(err);
                }
                else
                    res.json(result);
            });
        });





    router.route('/sendMessageToDoctor')
        .post(function(req,res){
            //var data= req.body.data;
            chatDoc.find({chat_receiver: req.body.receiver_id,chat_sender: req.user._id,post_id:null}).populate('message_ids').exec(function(err,resp){
                if(err)
                    res.json(err);
                else
                {
                    if(resp.length==0)
                    {
                        var message = new MessagesDoc();
                        message.type=req.body.type;
                        message.last_updated=new Date();
                        message.text=req.body.text;
                        if(req.body.imagePath)
                            message.image_path=req.body.imagePath;
                        else
                            message.image_path="";
                        message.save(function(err,result){
                            if(err)
                                res.json(err);
                            else
                                var myMessage=result;
                            var Chat = new chatDoc();
                            Chat.message_ids.push(myMessage._id);
                            Chat.post_id=null;
                            Chat.chat_receiver=req.body.receiver_id;
                            Chat.chat_sender=req.user._id;
                            Chat.last_updated=new Date();
                            Chat.save(function(err,response){
                                if(err)
                                    res.json(err);
                                else
                                    res.json(response);
                            });
                        })
                    }
                    else
                    {
                        var message = new MessagesDoc();
                        message.type=req.body.type;
                        message.last_updated=new Date();
                        message.text=req.body.text;
                        if(req.body.imagePath)
                            message.image_path=req.body.imagePath;
                        else
                            message.image_path="";
                        message.save(function(err,result){
                            if(err)
                                res.json(err);
                            else
                            {
                                var Chat = resp[0];
                                Chat.message_ids.push(result._id);
                                Chat.last_updated=new Date();
                                Chat.save(function(err,success){
                                    if(err)
                                        res.json(err);
                                    else
                                        res.json(success);
                                })
                            }
                        })
                    }
                }
            })
        });




    router.route('/answerQuestion')
        .post(function(req,res){
            //var data= req.body.data;
            chatDoc.find({post_id:req.body.idPost,chat_receiver:req.body.ownerPost,chat_sender:req.user._id}).populate('message_ids').exec(function(err,resp){
                if(err)
                    res.json(err);
                else
                {
                    if(resp.length==0)
                    {
                        var message = new MessagesDoc();
                        message.type=req.body.type;
                        message.last_updated=new Date();
                        message.text=req.body.text;
                        if(req.body.imagePath)
                            message.image_path=req.body.imagePath;
                        else
                            message.image_path="";
                        message.save(function(err,result){
                            if(err)
                                res.json(err);
                            else
                            {

                                var Chat = new chatDoc();
                                Chat.message_ids.push(result._id);
                                Chat.last_updated=new Date();
                                Chat.chat_sender=req.user._id;
                                Chat.chat_receiver=req.body.ownerPost;
                                Chat.post_id=req.body.idPost;
                                Chat.save(function(err,success){
                                    if(err)
                                        res.json(err);
                                    else
                                    {
                                        var MyChat = success;
                                        NewsPost.findOne({_id:req.body.idPost}).exec(function(err,MyPost){
                                           if(err)
                                                res.send(err);
                                            else
                                           {
                                               var newPost=MyPost;
                                               newPost.chat_id.push(MyChat._id);
                                               newPost.save(function(err,resultPost){
                                                   if(err)
                                                       res.send(err);
                                                   else
                                                       res.send(resultPost);
                                               })
                                           }
                                        });
                                    }
                                })

                            }
                        })
                    }
                    else
                    {
                        var message = new MessagesDoc();
                        message.type=req.body.type;
                        message.last_updated=new Date();
                        message.text=req.body.text;
                        if(req.body.imagePath)
                            message.image_path=req.body.imagePath;
                        else
                            message.image_path="";
                        message.save(function(err,result){
                            if(err)
                                res.json(err);
                            else
                            {

                                    var Chat = resp[0];
                                    Chat.message_ids.push(result._id);
                                    Chat.last_updated=new Date();
                                    Chat.save(function(err,success){
                                        if(err)
                                            res.json(err);
                                        else
                                            res.json(success);
                                    })

                            }


                        })
                    }
                }
            })
        });


    app.use('/apiMSDDoc', router);
};