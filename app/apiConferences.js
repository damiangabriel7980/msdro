/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose = require('mongoose');
var Events = require('./models/events');
var Conferences = require('./models/conferences');
var Talks = require('./models/talks');
var Speakers = require('./models/speakers');
var User = require('./models/user');
var Roles=require('./models/roles');
var Rooms = require('./models/rooms');
var Threads = require('./models/threads');
var Qa_messages = require('./models/qa_messages');
var Topics=require('./models/topics');
var jwt = require('jsonwebtoken');
var XRegExp  = require('xregexp').XRegExp;
var validator = require('validator');
var crypto   = require('crypto');
var expressJwt = require('express-jwt');
var async = require('async');
var request = require('request');

module.exports = function(app, mandrill, logger, tokenSecret, router) {

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

    var getTalksByConference = function (conference_id, callback) {
        Talks.find({conference: conference_id}).sort({hour_start: 1}).populate('room speakers').exec(function (err, talks) {
            if(err){
                callback(err, null);
            }else{
                callback(null, talks);
            }
        });
    };

    var getTalksByRoom = function (room_id, callback) {
        Talks.find({room: room_id}).sort({hour_start: 1}).populate('room speakers').exec(function (err, talks) {
            if(err){
                callback(err, null);
            }else{
                callback(null, talks);
            }
        });
    };

    var getConferencesForUser = function (id_user, callback) {
        var resp = [];
        User.findOne({_id: id_user}, function (err, user) {
            if(err){
                callback(err, null);
            }else{
                //get all conferences for this user
                Conferences.find({_id: {$in: user.conferencesID}}, function (err, conferences) {
                    if(err){
                        callback(err, null);
                    }else{
                        if(conferences.length != 0){
                            //get all talks for each conference async
                            async.each(conferences, function (conference, cb) {
                                var conf = conference.toObject();
                                getTalksByConference(conference._id, function (err, talks) {
                                    if(err){
                                        cb(err);
                                    }else{
                                        conf.talks = talks;
                                        resp.push(conf);
                                        cb();
                                    }
                                });
                            }, function (err) {
                                if(err){
                                    callback(err, null);
                                }else{
                                    callback(null, resp);
                                }
                            });
                        }else{
                            callback(null, conferences);
                        }
                    }
                });
            }
        });
    };

    var addConferenceToUser = function (id_conference, id_user, callback) {
        User.update({_id: id_user}, {$addToSet: {conferencesID: id_conference}}, {multi: false}, function (err, res) {
            callback(err, res);
        });
    };

    //================================================================================================= access control and route protection
    //access control allow origin *
    app.all("/apiConferences/*", function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
        next();
    });

    // We are going to protect /apiConferences routes with JWT
    app.use('/apiConferences', expressJwt({secret: tokenSecret}).unless({path: ['/apiConferences/createAccount']}));

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
                                                    text: 'Ati primit acest email deoarece v-ati inregistrat pe MSD Staywell.\n\n' +
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

    //route for retrieving user's profile info
    router.route('/userProfile')
        .get(function (req, res) {
            res.json(getUserData(req));
        });

    //==================================================================================================================== all routes

    router.route('/getConferencesFull')
        .get(function (req, res) {
            var user = getUserData(req);
            if(user._id){
                getConferencesForUser(user._id, function (err, resp) {
                    if(err){
                        res.send(err);
                    }else{
                        res.send(resp);
                    }
                });
            }else{
                res.send([]);
            }
        });

    router.route('/scanConference')
        .post(function (req, res) {
            var idConf = mongoose.Types.ObjectId(req.body.id.toString());
            var thisUser = getUserData(req);
            //check if conference exists
            Conferences.findOne({_id: idConf}, function (err, conference) {
                if(err){
                    res.send(err);
                }else{
                    if(conference){
                        //add conference id to user
                        addConferenceToUser(idConf, thisUser._id, function (err, resp) {
                            if(err){
                                res.send(err);
                            }else{
                                //return talks for the scanned conference
                                getTalksByConference(idConf, function (err, talks) {
                                    if(err){
                                        res.send(err);
                                    }else{
                                        res.send(talks);
                                    }
                                });
                            }
                        })
                    }else{
                        res.send({hasError: true, message: "Conference not found"});
                    }
                }
            });
        });

    router.route('/scanRoom')
        .post(function (req, res) {
            var idRoom = mongoose.Types.ObjectId(req.body.id.toString());
            //get id of conference
            Talks.findOne({room: idRoom}, function (err, talk) {
                if(err){
                    res.send(err);
                }else{
                    if(talk){
                        var idConf = talk.conference;
                        var thisUser = getUserData(req);
                        addConferenceToUser(idConf, thisUser._id, function (err, resp) {
                            if(err){
                                res.send(err);
                            }else{
                                //return talks for the scanned room
                                getTalksByRoom(idRoom, function (err, talks) {
                                    if(err){
                                        res.send(err);
                                    }else{
                                        res.send(talks);
                                    }
                                });
                            }
                        });
                    }else{
                        res.send({hasError: true, message: "Room not found"});
                    }
                }
            });
        });

    app.use('/apiConferences', router);
};