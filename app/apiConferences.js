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


module.exports = function(app, mandrill, logger, tokenSecret, pushServerAddr, router) {

    //returns user data (parsed from token found on the request)
    var getUserData = function (req) {
        var token = req.headers.authorization.split(' ').pop();
        return jwt.decode(token);
    };

    //================================================================================================================= functions for getting data in depth

    //get room -> talks (in depth)
    var getRoomDataById = function (id, callback) {
        //find the actual room
        Rooms.findOne({_id: id}, function (err, room) {
            if (err){
                callback(err, null);
            }else{
                if(room){
                    //find all talks for this room and populate speakers
                    Talks.find({_id: {$in: room.id_talks}}).sort({hour_start: 1}).populate('listSpeakers').exec(function (err, talks) {
                        if(err){
                            callback(err, null);
                        }else{
                            if(talks){
                                //cast room object so that we can modify it's attributes
                                var result = room.toObject();
                                //add talks to copied object and return the result
                                //result will be the room, with all the talks and all speakers for each talk
                                result.talks = talks;
                                callback(null, result);
                            }else{
                                callback(null, room);
                            }
                        }
                    });
                }else{
                    callback({hasError: true, message: "Room not found"}, null);
                }
            }
        })
    };

    //get conferences -> rooms -> talks (in depth)
    var getConferencesFull = function (req, callback) {
        var resp = [];
        //get user data
        var userData = getUserData(req);
        if(userData.username){
            //get user so that we can have the id's of conferences he/she can attend
            User.findOne({username: userData.username}, function (err, user) {
                if(err){
                    res.send(err);
                }else{
                    //find conferences for our user; we are only interested in id's for now
                    Conferences.find({_id:{$in: user.conferencesID}}, {_id: 1}, function (err, conferences) {
                        if(err){
                            callback(err, null);
                        }else{
                            if(conferences.length != 0){
                                //for each conference id get full in-depth data async
                                async.each(conferences, function (conference, callback) {
                                    getConferenceFullById(conference._id, function (err, fullConf) {
                                        if(err){
                                            callback(err);
                                        }else{
                                            //push data to response array
                                            resp.push(fullConf);
                                            callback();
                                        }
                                    });
                                }, function (err) {
                                    if(err){
                                        callback({hasError: true, message: "Error retrieving conferences"}, null);
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
        }else{
            res.send({hasError: true, message:"User not found"});
        }
    };

    //get one conference -> rooms -> talks (in depth)
    var getConferenceFullById = function (id, callback) {
        //find the conference
        Conferences.findOne({_id: id}, function (err, conf) {
            if(err){
                callback(err, null);
            }else{
                if(conf){
                    //cast the found conference to object so that we can modify it's attributes
                    var result = conf.toObject();
                    //add 'rooms' key to our result object
                    result['rooms'] = [];
                    //find the id's of all rooms for this conference
                    Rooms.find({id_conference: conf._id}, {_id:1},function (err, rooms) {
                        if(err){
                            res.send(err);
                        }else{
                            if(rooms){
                                //iterate async through the room id's
                                async.each(rooms, function (item, callback) {
                                    //get room and all in-depth attributes for each id
                                    getRoomDataById(item._id, function (err, data) {
                                        if(err){
                                            callback(err);
                                        }else{
                                            //add the data to our result's 'room' key
                                            result['rooms'].push(data);
                                            callback();
                                        }
                                    })
                                }, function (err) {
                                    if(err){
                                        callback(err, null);
                                    }else{
                                        callback(null, result);
                                    }
                                });
                            }else{
                                callback(null, result);
                            }
                        }
                    });
                }else{
                    callback({hasError:true, message:"No conference found by id = "+id}, null);
                }
            }
        })
    };

    //================================================================================ find id's of users associated to conferences, rooms, talks

    //receives an array of documents and returns an array with only the id's of those documents
    var getIds = function (arr, cb) {
        var ret = [];
        async.each(arr, function (item, callback) {
            ret.push(item._id);
            callback();
        }, function (err) {
            cb(ret);
        });
    };

    // get user ids
    // return array like ["MSD"+idAsString]
    var encodeNotificationsIds = function (ids, cb) {
        var ret = [];
        async.each(ids, function (id, callback) {
            ret.push("MSD"+id.toString());
            callback();
        }, function (err) {
            cb(ret);
        });
    };

    //this can be used for rooms as well, since every room has an id_conference
    var getUsersForConference = function (id_conference, callback) {
        User.find({conferencesID: {$in: [id_conference]}}, function (err, users) {
            if(err){
                callback(err, null);
            }else{
                getIds(users, function (ids) {
                    callback(null, ids);
                });
            }
        });
    };

    var getUsersForTalk = function (id_talk, callback) {
        //find the room this talk takes place in
        Rooms.findOne({id_talks: {$in: [id_talk]}}, function (err, room) {
            if(err){
                callback(err, null);
            }else{
                if(!room){
                    callback("Talk is not attached to any room", null);
                }else{
                    //we have the room => id_conference
                    getUsersForConference(room.id_conference, function (err, ids) {
                        if(err){
                            callback(err, null);
                        }else{
                            callback(null, ids);
                        }
                    });
                }
            }
        });
    };

//    router.route('/someTest')
//        .get(function (req, res) {
//            getUsersForTalk("5493f914ac0e91ba132582ed", function(err, users){
//                if(err){
//                    res.send(err);
//                }else {
//                    sendPushNotification("push notifications working", users, function (err, success) {
//                        res.send(err);
//                        res.send(success);
//                    });
//                }
//            });
//        });

    //================================================================================================= send push notifications

    var sendPushNotification = function (message, arrayUsersIds, callback) {
        encodeNotificationsIds(arrayUsersIds, function (usersToSendTo) {
            var data = {
                "users": usersToSendTo,
                "android": {
                    "collapseKey": "optional",
                    "data": {
                        "message": message
                    }
                },
                "ios": {
                    "badge": 0,
                    "alert": message,
                    "sound": "soundName"
                }
            };

            request({
                url: pushServerAddr+"/send",
                method: 'POST',
                json: true,
                body: data
            }, function (error, message, response) {
                callback(error, response);
            });
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

//    router.route('/speakers')
//        .get(function(req,res){
//            Speakers.find().populate('listTalks').exec(function (err, speakers) {
//                if (err)
//                {
//                    res.json(err);
//                    return;
//                }
//                else
//                {
//                    res.json(speakers);
//                    return;
//                }
//        })
//        });
//    router.route('/speakers/:id')
//        .get(function(req,res){
//            Speakers.findById(req.params.id).populate('listTalks').exec(function (err, speaker) {
//                if (err)
//                {
//                    res.json(err);
//                    return;
//                }
//                else
//                {
//                    res.json(speaker);
//                    return;
//                }
//            })
//        });

    //==================================================================================================================== all routes
    router.route('/conferences')
        .get(function(req,res){
            var userCurrent = getUserData(req);
            User.findOne({'username':userCurrent.username}).exec(function(err,result){
                Conferences.find({_id:{$in: result.conferencesID}}).exec(function (err, conferences) {
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

        })
    .post(function(req,res){
            console.log("entered");
            var id = req.body.id;
            if(typeof id === "string")
                id=mongoose.Types.ObjectId(id);

            console.log(id);

        var userCurrent = getUserData(req);
            console.log(userCurrent.username);
        var check=false;
        User.update({"username":userCurrent.username}, {$addToSet: {"conferencesID":id}},function(err,result){
            if(err)
            {
                console.log(err);
                res.send(err);

            }
            else{
                getConferenceFullById(req.body.id, function (err, data) {
                    if(err){
                        res.send(err);
                    }else{
                        res.send(data);
                    }
                });
            }

        });
    })
        .delete(function(req,res){
            var id = req.body.id;
            var userCurrent = getUserData(req);
            console.log(userCurrent.username);
            User.update({"username":userCurrent.username},{ $pull: { conferencesID: id  } },function(err,result){
                if(err)
                    res.send(err);
                else
                    res.json(result);
            });
        });

//    router.route('/conferences/:id')
//        .get(function(req,res){
//            Conferences.findById(req.params.id).populate('listTalks').exec(function (err, conference) {
//                if (err)
//                {
//                    res.json(err);
//                    return;
//                }
//                else
//                {
//                    res.json(conference);
//                    return;
//                }
//            })
//        })

//    router.route('/events')
//        .get(function(req,res){
//            Events.find().populate('listconferences').exec(function (err, events) {
//                if (err)
//                {
//                    res.json(err);
//                    return;
//                }
//                else
//                {
//                    res.json(events);
//                    return;
//                }
//            })
//        });
//    router.route('/events/:id')
//        .get(function(req,res) {
//            Events.findById(req.params.id).populate('listconferences').exec(function (err, event) {
//                if (err) {
//                    res.json(err);
//                    return;
//                }
//                else {
//                    var arrTalks=[];
//                    Conferences.find({_id:{$in: event.listconferences}}).populate('listTalks').exec(function(err,info){
//                       event.listconferences=info;
//                        var local=event.listconferences;
//                        //console.log(local);
//                        res.json(event);
//                        });
//
//                    return;
//                }
//
//            })
//        });
//    router.route('/talks')
//        .get(function(req,res){
//            Talks.find({}).populate('listSpeakers listRooms').exec(function (err, talks) {
//                if (err)
//                {
//                    res.json(err);
//                    return;
//                }
//                else
//                {
//                    res.json(talks);
//                    return;
//                }
//
//
//            })
//
//        })
//    router.route('/talks/:id')
//        .get(function(req,res){
//            Talks.findById(req.params.id).populate('listSpeakers listRooms').exec(function (err, talk) {
//                if (err)
//                {
//                    res.json(err);
//                    return;
//                }
//                else
//                {
//                    res.json(talk);
//                    return;
//                }
//
//
//            })
//
//        })
//
//    router.route('/rooms')
//        .get(function(req,res){
//            Rooms.find().populate('id_talks').exec(function (err, rooms) {
//                if (err)
//                {
//                    res.json(err);
//                    return;
//                }
//                else
//                {
//                    res.json(rooms);
//                    return;
//                }
//
//
//            })
//
//        });

    router.route('/talks')
        .get(function(req,res){
            Talks.find({}).populate('listSpeakers listRooms').exec(function (err, talks) {
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

        })
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
            getRoomDataById(req.params.id, function (err, data) {
                if(err){
                    res.send(err);
                }else{
                    res.send(data);
                }
            });
        });

    router.route('/getConferencesFull')
        .get(function (req, res) {
            getConferencesFull(req, function (err, resp) {
                if(err){
                    res.send(err);
                }else{
                    res.send(resp);
                }
            });
        });

//    router.route('/getConferencesFull')
//        .get(function (req, res) {
//
//            var findById = function (arr, id, callbackFinal) {
//                var retObj = null;
//                async.each(arr, function (it, callback) {
//                    if(it._id == id){
//                        retObj = it;
//                        callback(true);
//                    }else{
//                        callback();
//                    }
//                }, function (whatever) {
//                    callbackFinal(retObj);
//                });
//            };
//
//            //object that will be populated with all the data
//            var allData = {};
//
//            //entities relationships [from, via, to]
//            var mappings = [
//                ["conferences", "listTalks", "talks"],
//                ["talks", "listSpeakers", "speakers"],
//                ["talks", "listRooms", "rooms"]
//            ];
//
//            //entity to return after connecting all
//            var etr = 'conferences';
//
//            //array keeping references to the entities we need to iterate through
//            var myEntities = [Conferences, Talks, Speakers, Rooms];
//
//            //populate async
//            async.each(myEntities, function (entity, callback) {
//                entity.find({}, function (err, data) {
//                    if(err){
//                        callback(err);
//                    }else{
//                        allData[entity.modelName] = data;
//                        callback();
//                    }
//                })
//            }, function (err) {
//                if(err){
//                    res.json(err);
//                }else{
//                    //console.log(allData);
//                    async.each(mappings, function (mappingKey, callback1) {
//                        var base = mappingKey[0];
//                        var connection = mappingKey[1];
//                        var connected = mappingKey[2];
//                        async.each(allData[base], function (entity, callback2) {
//                            //console.log(entity._id+" - "+entity[connection]);
//                            var idFrom = entity._id;
//                            var arrayIdsTo = entity[connection];
//                            async.each(arrayIdsTo, function (idTo, callback3) {
//                                //console.log(base+" - "+idFrom+" - "+connected+" - "+idTo);
//                                findById(allData[base],idFrom, function (cFrom) {
//                                    findById(allData[connected],idTo.toString(), function (cTo) {
//                                        var index = cFrom[connection].indexOf(idTo); //find [id] to replace with [object with that id]
//                                        if(cFrom == null || cTo == null || index < 0){
//                                            //something went wrong
//                                            //propagate an error through all the callbacks
//                                            callback3("Error retrieving data");
//                                        }else{
//                                            cFrom[connection][index]= cTo; //replace id with object
//                                            callback3();
//                                        }
//                                    });
//                                });
//                            }, function (err) {
//                                if(err){
//                                    callback2(err);
//                                }else{
//                                    callback2();
//                                }
//                            });
//                        }, function (err) {
//                            if(err){
//                                callback1(err);
//                            }else{
//                                callback1();
//                            }
//                        });
//                    }, function (err) {
//                        if(err){
//                            logger.error(err);
//                            res.send(err);
//                        }else{
//                            res.send(allData[etr]);
//                        }
//                    });
//                }
//            });
//        });
    router.route('/topics')
        .get(function(res,res){
            Topics.find().exec(function(err,result){
                if(err)
                    res.send(err);
                else
                    res.json(result);
            })
        });
    router.route('/topics/:id')
        .get(function(res,res){
            Topics.findById(req.params.id).exec(function(err,result){
                if(err)
                    res.send(err);
                else
                    res.json(result);
            })
        });
    router.route('/threads')
        .get(function(res,res){
            Threads.find({receiver:{'$ne': null }}).populate('id_messages').exec(function(err,result){
                if(err)
                    res.send(err);
                else
                    res.json(result);
            })
        })
        .post(function(req,res){
            var message = new Qa_messages()
            var thread = new Threads();
            var userCurrent = getUserData(req);
            var check=false;
            User.find({"username":userCurrent.username},function(err,result){
                if(err)
                {
                    console.log(err);
                    res.send(err);

                }
                else{
                    var id = result._id;
                    message.message_text= req.body.message_text;
                    message.type= req.body.type;
                    message.owner = id;
                    message.save(function (err,response){
                       if(err)
                            res.send(err);
                        else
                       {
                           thread.sender=id;
                           thread.receiver=null;
                           thread.blocked = false;
                           thread.topic= req.body.topic;
                           thread.id_messages.push(response._id);
                           thread.save(function(err,resp){

                           });
                       }
                    });



                }
            })
        });
    router.route('/threads/:id')
        .get(function(res,res){
            Threads.findById(req.params.id).populate('id_messages').exec(function(err,result){
                if(err)
                    res.send(err);
                else
                    res.json(result);
            })
        })
        .put(function(req,res){

    });
    app.use('/apiConferences', router);
};