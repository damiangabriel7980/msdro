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

var jwt = require('jsonwebtoken');
var XRegExp  = require('xregexp').XRegExp;
var validator = require('validator');
var crypto   = require('crypto');
var expressJwt = require('express-jwt');
var async = require('async');


module.exports = function(app, mandrill, tokenSecret, router) {

    var getUserData = function (req) {
        var token = req.headers.authorization.split(' ').pop();
        return jwt.decode(token);
    };
    
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
    app.use('/apiConferences', expressJwt({secret: tokenSecret}).unless({path: ['/apiConferences/createAccount','/apiConferences/testConferences']}));

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
                                                        console.log(errm);
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

    router.route('/userProfile')
        .get(function (req, res) {
            res.json(getUserData(req));
        });

    router.route('/speakers')
        .get(function(req,res){
            Speakers.find().populate('listTalks').exec(function (err, speakers) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(speakers);
                    return;
                }
        })
        });
    router.route('/speakers/:id')
        .get(function(req,res){
            Speakers.findById(req.params.id).populate('listTalks').exec(function (err, speaker) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(speaker);
                    return;
                }
            })
        });
    router.route('/conferences')
        .get(function(req,res){
            Conferences.find().populate('listTalks').exec(function (err, conferences) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(conferences);
                    return;
                }
            })
        });
    router.route('/conferences/:id')
        .get(function(req,res){
            Conferences.findById(req.params.id).populate('listTalks').exec(function (err, conference) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(conference);
                    return;
                }
            })
        });

    router.route('/events')
        .get(function(req,res){
            Events.find().populate('listconferences').exec(function (err, events) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(events);
                    return;
                }
            })
        });
    router.route('/events/:id')
        .get(function(req,res) {
            Events.findById(req.params.id).populate('listconferences').exec(function (err, event) {
                if (err) {
                    res.json(err);
                    return;
                }
                else {
                    var arrTalks=[];
                    Conferences.find({_id:{$in: event.listconferences}}).populate('listTalks').exec(function(err,info){
                       event.listconferences=info;
                        var local=event.listconferences;
                        //console.log(local);
                        res.json(event);
                        });

                    return;
                }

            })
        });
    router.route('/talks')
        .get(function(req,res){
            Talks.find().populate('listSpeakers listRooms').exec(function (err, talks) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(talks);
                    return;
                }


            })
                .post(function(req,res){
                    User.findOne()
                })
        });
    router.route('/talks/:id')
        .get(function(req,res){
            Talks.findById(req.params.id).populate('listSpeakers listRooms').exec(function (err, talk) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(talk);
                    return;
                }


            })

        })
    .put(function(req,res){
        var userCurrent = getUserData(req);
        User.findOne({'username':userCurrent.username}).exec(function(err,result){
            result.talksID.push(req.params.id);
            result.save(function(err,done){
                if(err)
                    res.json(err);
                else
                {
                    console.log(result);
                    res.json({'message':'Succes!'});
                }
            });


        });
    });
    router.route('/rooms')
        .get(function(req,res){
            Rooms.find().populate('id_talks').exec(function (err, rooms) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(rooms);
                    return;
                }


            })

        });
    router.route('/rooms/:id')
        .get(function(req,res){
            Rooms.findById(req.params.id).populate('id_talks').exec(function (err, room) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(room);
                    return;
                }


            })

        });

    router.route('/testConferences')
        .get(function (req, res) {

            var findById = function(arr, id, callback){
                for(var i=0; i<arr.length; i++){
                    if(arr[i]._id == id){
                        callback(arr[i]);
                    }
                }
            };

            //object that will be populated with all the data
            var allData = {};

            //entities relationships [from, via, to]
            var mappings = [
                ["conferences", "listTalks", "talks"],
                ["talks", "listSpeakers", "speakers"],
                ["talks", "listRooms", "rooms"]
            ];

            var myEntities = [Conferences, Talks, Speakers, Rooms];

            //populate async
            async.each(myEntities, function (entity, callback) {
                entity.find({}, function (err, data) {
                    if(err){
                        callback(err);
                    }else{
                        allData[entity.modelName] = data;
                        callback();
                    }
                })
            }, function (err) {
                if(err){
                    res.json(err);
                }else{
                    console.log(allData);
                    var conferences = allData['conferences'];
                    async.each(mappings, function (mappingKey, callback1) {
                        var base = mappingKey[0];
                        var connection = mappingKey[1];
                        var connected = mappingKey[2];
                        async.each(allData[base], function (entity, callback2) {
                            //console.log(entity._id+" - "+entity[connection]);
                            var idFrom = entity._id;
                            var arrayIdsTo = entity[connection];
                            async.each(arrayIdsTo, function (idTo, callback3) {
                                //console.log(base+" - "+idFrom+" - "+connected+" - "+idTo);
                                findById(allData[base],idFrom, function (cFrom) {
                                    findById(allData[connected],idTo.toString(), function (cTo) {
                                        var index = cFrom[connection].indexOf(idTo);
                                        cFrom[connection][index]= cTo;
                                        callback3();
                                    });
                                });
                            }, function (err) {
                                callback2();
                            });
                        }, function (err) {
                            callback1();
                        });
                    }, function (err) {
                        res.send(allData['conferences']);
                    });
                }
            });
        });

    app.use('/apiConferences', router);
};