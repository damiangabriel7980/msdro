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
var jwt = require('jsonwebtoken');
var XRegExp  = require('xregexp').XRegExp;
var validator = require('validator');
var crypto   = require('crypto');
var expressJwt = require('express-jwt');
var async = require('async');
var request = require('request');

module.exports = function(app, logger, tokenSecret, pushServerAddr, router) {

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

    var getConference = function (id_conference, callback) {
        Conferences.findOne({_id: id_conference}, function (err, conference) {
            if(err){
                callback(err, null);
            }else{
                if(!conference){
                    callback({hasError: true, message: "Conference not found"});
                }else{
                    var ret = conference.toObject();
                    getTalksByConference(conference._id, function (err, talks) {
                        if(err){
                            callback(err, null);
                        }else{
                            ret.talks = talks;
                            callback(null, ret);
                        }
                    });
                }
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
    app.use('/apiConferences', expressJwt({secret: tokenSecret}).unless({path: ['/apiConferences/createAccount', '/apiConferences/resetPass']}));

    //===================================================================================================================== create account
    router.route('/createAccount')
        .post(function (req, res) {
            res.redirect(307, '/apiGloballyShared/createAccountMobile');
        });

    //generate token for resetting user password
    router.route('/resetPass')
        .post(function(req, res) {
            res.redirect(307, '/apiGloballyShared/requestPasswordReset');
        });

    //route for retrieving user's profile info
    router.route('/userProfile')
        .get(function (req, res) {
            res.json(getUserData(req));
        });

    //=========================================================================================== unsubscribe from push notifications

    router.route('/unsubscribeFromPush')
        .post(function (req, res) {
            var token = req.body.token;
            //var userData = getUserData(req);
            if(token){
                var unsubscribeData = {
                    "token": token
                };
                request({
                    url: pushServerAddr+"/unsubscribe",
                    method: "POST",
                    json: true,
                    body: unsubscribeData,
                    strictSSL: false
                }, function (error, message, response) {
                    if(error){
                        res.json({hasError: true, message:"Error unsubscibing from push notifications"});
                    }else{
                        res.json({hasError: false, message:"Successfully unsubscribed from push notifications"});
                    }
                });
            }else{
                res.json({hasError: true, message:"No token received"});
            }
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
                                //return scanned conference
                                getConference(idConf, function (err, conference) {
                                    if(err){
                                        res.send(err);
                                    }else{
                                        res.send(conference);
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
                                //return scanned conference
                                getConference(idConf, function (err, conference) {
                                    if(err){
                                        res.send(err);
                                    }else{
                                        res.send(conference);
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