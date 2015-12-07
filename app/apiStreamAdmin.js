/**
 * Created by andreimirica on 16.11.2015.
 */
var LiveConference = require('./models/liveConferences');
var Q = require('q');
var AWS = require('aws-sdk');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Therapeutic_Area = require('./models/therapeutic_areas');
var UserGroup = require('./models/userGroup');
var User = require('./models/user');
var UtilsModule = require('./modules/utils');
var MailerModule = require('./modules/mailer');
var async = require('async');


module.exports = function(app, env, sessionSecret, logger, amazon, router) {
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);

    router.route('/streamAdmin/s3tc')
        .get(function (req, res) {
            amazon.getS3Credentials(req.user.username, function(err, data){
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, data);
                }
            });
        });
    //======================================

    router.route('/streamAdmin/liveConferences')
        .get(function(req,res){
            if(req.query.id){
                if(req.query.separatedViewers){
                    LiveConference.find({_id:req.query.id}).exec(function (err, conference) {
                        if(err) { handleError(res, err); }
                        if(conference.length == 0) { handleError(res,err,404,1); }
                        else
                            var viewers = {
                                registered: [],
                                unregistered: []
                            };
                            var data = {username: 1, name: 1};
                            async.eachSeries(conference[0].viewers, function (viewer, callback) {
                                User.find({username : viewer.username}, data).limit(0).exec(function(err, cont) {
                                    if(err) {
                                        callback(err)
                                    }else{
                                        if(cont.length == 0)
                                            viewers.unregistered.push(viewer);
                                        else
                                            viewers.registered.push(viewer);
                                        callback();
                                    }
                                });
                            }, function (err) {
                                if(err){
                                    handleError(res, err);
                                }else{
                                    handleSuccess(res,viewers);
                                }
                            });
                    });
                } else {
                    LiveConference.find({_id:req.query.id}).populate('therapeutic-areasID').sort({date : -1}).exec(function (err, conference) {
                        if(err) { handleError(res, err); }
                        if(conference.length == 0) { handleError(res,err,404,1); }
                        else
                            handleSuccess(res,conference[0]);
                    });
                }
            } else {
                LiveConference.find().exec(function (err, conferences) {
                    if(err) { handleError(res, err); }
                    else
                        handleSuccess(res,conferences);
                });
            }
        })
        .post(function(req,res){
            req.body.last_modified = new Date();
            LiveConference.create(req.body, function(err, conference) {
                if(err) { return handleError(res, err); }
                return handleSuccess(res,conference);
            });
        })
        .put(function(req,res){
            if(req.body._id)
            { delete req.body._id; }
            if(req.query.status){
                LiveConference.update({_id: req.query.id}, {enabled: !req.body.isEnabled}, function (err, wRes) {
                    if(err){
                        return handleError(res, err);
                    }else{
                        handleSuccess(res,{success: wRes});
                    }
                });
            } else if(req.query.updateImage) {
                LiveConference.update({_id: req.query.id}, {$set: {image_path: req.body.image_path}}, function (err, wRes) {
                    if(err){
                        return handleError(res, err);
                    }else{
                        handleSuccess(res,{success: wRes});
                    }
                });
            } else if(req.query.removeUser) {
                var userData = req.body;
                if (userData.role == 'speaker'){
                        LiveConference.update({_id: req.query.id}, {$pull: {'speakers': {username: userData.username}}}, function (err, wRes) {
                            if(err){
                                handleError(res, err);
                            }else{
                                handleSuccess(res,{success: wRes});
                            }
                        });
                }
                else {
                        LiveConference.update({_id: req.query.id}, {$pull: {'viewers': {username: userData.username}}}, function (err, wRes) {
                            if(err){
                                handleError(res, err);
                            }else{
                                handleSuccess(res,{success: wRes});
                            }
                        });
                }
            } else if(req.query.addSpeaker){
                    LiveConference.findOneAndUpdate({_id: req.query.id}, {$set: {speakers: req.body}}).exec(function (err, wres) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res,wres);
                        }
                    });
            } else if(req.query.addViewers){
                    LiveConference.findOneAndUpdate({_id: req.query.id}, {$set: {viewers: req.body}}).exec(function (err, wres) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res,wres);
                        }
                    });
            }
             else
            {
                LiveConference.find({_id: req.query.id}, function (err, conference) {
                    if(err){
                        handleError(res, err);
                    }else{
                        if(conference.length == 0)
                            { handleError(res,err,404,1); }
                        else {

                            if(conference[0].moderator.username){
                                if(req.body.moderator.username){
                                    if(conference[0].moderator.username.toLowerCase() != req.body.moderator.username.toLowerCase())
                                            conference[0].moderator = req.body.moderator;
                                } else {
                                    conference[0].moderator = {
                                        name: null,
                                        username: null
                                    }
                                }
                            } else
                                conference[0].moderator = req.body.moderator;
                            LiveConference.findOneAndUpdate({_id: req.query.id}, {$set: {moderator: conference[0].moderator, last_modified: req.body.last_modified, name: req.body.name, description: req.body.description, location: req.body.location, date: req.body.date, 'therapeutic-areasID': req.body['therapeutic-areasID']}}).exec(function (err, wres) {
                                if(err){
                                    handleError(res, err);
                                }else{
                                    handleSuccess(res,wres);
                                }
                            });
                        }
                    }
                });
            }
        })
        .delete(function(req,res){
            LiveConference.findById(req.query.id, function (err, conference) {
                if(err) {
                    handleError(res, err);
                }
                if(conference.image){
                    amazon.deleteObjectS3(conference.image, function (err, data) {
                        if(err){
                            handleError(res, err);
                        }else{
                            conference.remove(function(err) {
                                if(err) {
                                    handleError(res, err);
                                } else {
                                    handleSuccess(res, {}, 4);
                                }
                            });
                        }
                    })
                } else {
                    conference.remove(function(err) {
                        if(err) {
                            handleError(res, err);
                        } else {
                            handleSuccess(res, {}, 4);
                        }
                    });
                }
            });
        });

    router.route('/streamAdmin/checkEmail')
        .post(function(req,res){
            if(req.query.checkIfExists){
                //first check if the user is exists in the database
                User.aggregate([
                    { $project: {username: {$toLower: "$username"}} },
                    { $match: {username: req.body.username.toLowerCase()} },
                    { $project: {_id:0, email: "$username"} }
                ], function (err, users) {
                    if(err){
                        handleError(res, err);
                    }else{
                        if(users.length > 0)
                            handleError(res,null,400,47);
                        else
                            handleSuccess(res, users);
                    }
                });
            } else if(req.query.checkEmailAddress) {
                var patt = UtilsModule.regexes.email;
                if(!patt.test(req.body.username.toString())){
                    handleError(res,null,400,31);
                }else
                    handleSuccess(res);
            }
        });

    router.route('/streamAdmin/users')
        .get(function(req,res){
            var data = {username: 1, name: 1, profession: 1};
            if(req.query.groups)
                data['groupsID'] = 1;
            User.find({}, data).populate('groupsID profession').limit(0).exec(function(err, cont) {
                if(err) {
                    handleError(res,err,500);
                }else{
                    handleSuccess(res,cont);
                }
            });
        });

    router.route('/streamAdmin/groups')
        .get(function(req,res){
            var data = {display_name: 1};
            UserGroup.find({}, data).limit(0).exec(function(err, cont) {
                if(err) {
                    handleError(res,err,500);
                }else{
                    handleSuccess(res,cont);
                }
            });
        });

    var getMergeVars =function (users){
        var deferred = Q.defer();
        var mergeVars = [];
        async.each(users, function (user, callback) {
            mergeVars.push({
                "rcpt": user.email,
                "vars": [{
                    "name": "userName",
                    "content": user.name
                }]
            });
            callback();
        }, function (err) {
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(mergeVars);
            }
        });
        return deferred.promise;
    };

    var getUsersInMandrillFormat =function (users, forInvitation){
        var deferred = Q.defer();
        var usersModified = [];
        async.each(users, function (user, callback) {
            if(forInvitation){
                if(!user.invited)
                    usersModified.push({
                        "email": user.username,
                        "name": user.name
                    });
            } else {
                usersModified.push({
                    "email": user.username,
                    "name": user.name
                });
            }
            callback();
        }, function (err) {
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(usersModified);
            }
        });
        return deferred.promise;
    };

    router.route('/streamAdmin/sendNotification')

        .put(function (req,res) {
            LiveConference.find({_id: req.query.id}).exec(function(err,conference){
                if(err)
                    handleError(res,err,500);
                else {
                    var eventDate = new Date(conference[0].date);
                    var day = eventDate.getDate();
                    var month = eventDate.getMonth() + 1;
                    var year = eventDate.getFullYear();
                    var confDate = day + '/' + month + '/' + year;
                    var hour;
                    var minutes;
                    if(eventDate.getHours() < 10)
                        hour = '0' + eventDate.getHours();
                    else
                        hour = eventDate.getHours();
                    if(eventDate.getMinutes() < 10)
                        minutes = '0' + eventDate.getMinutes();
                    else
                        minutes = eventDate.getMinutes();
                    async.series([
                        function (callback) {
                            getUsersInMandrillFormat(conference[0].speakers).then(
                                function(newUsers){
                                    getMergeVars(newUsers).then(
                                        function(mergeVars){
                                            MailerModule.sendNotification(
                                                "msd_users_notif",
                                                [],
                                                newUsers,
                                                'Actualizare date conferinta ' + conference[0].name,
                                                true,
                                                confDate,
                                                hour + ':' + minutes,
                                                conference[0].name,
                                                'speaker',
                                                req.body.spkString,
                                                'http://qconferences.qualitance.com',
                                                mergeVars
                                            ).then(
                                                function (success) {
                                                    callback(success);
                                                },
                                                function (err) {
                                                    callback(err);
                                                }
                                            );
                                        },
                                        function(err){
                                            callback(err);
                                        }
                                    );
                                },
                                function(err){
                                    callback(err);
                                }
                            );
                        },
                        function (callback) {
                            getUsersInMandrillFormat(conference[0].viewers).then(
                                function(newUsers){
                                    getMergeVars(newUsers).then(
                                        function(mergeVars){
                                            MailerModule.sendNotification(
                                                "msd_users_notif",
                                                [],
                                                newUsers,
                                                'Actualizare date conferinta ' + conference[0].name,
                                                true,
                                                confDate,
                                                hour + ':' + minutes,
                                                conference[0].name,
                                                'invitat',
                                                req.body.spkString,
                                                'http://qconferences.qualitance.com',
                                                mergeVars
                                            ).then(
                                                function (success) {
                                                    callback(success);
                                                },
                                                function (err) {
                                                    callback(err);
                                                }
                                            );
                                        },
                                        function(err){
                                            callback(err);
                                        }
                                    );
                                },
                                function(err){
                                    callback(err);
                                }
                            );
                        },
                        function(callback)
                        {
                            if(conference[0].moderator.username){
                                MailerModule.sendNotification(
                                    "msd_users_notif",
                                    [],
                                    [{email: conference[0].moderator.username, name: conference[0].moderator.name}],
                                    'Actualizare date conferinta ' + conference[0].name,
                                    true,
                                    confDate,
                                    hour+ ':' + minutes,
                                    conference[0].name,
                                    'moderator',
                                    req.body.spkString,
                                    'http://qconferences.qualitance.com',
                                    [{
                                        "rcpt": conference[0].moderator.username,
                                        "vars": [{
                                            "name": "userName",
                                            "content": conference[0].moderator.name
                                        }]
                                    }]
                                ).then(
                                    function (success) {
                                        callback(success);
                                    },
                                    function (err) {
                                        callback(err);
                                    }
                                );
                            } else
                                callback();
                        }
                    ], function (err) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res);
                        }
                    });
                }
            });
        })

        .post(function(req, res) {
            LiveConference.find({_id: req.query.id}).exec(function(err,conference){
                if(err)
                    handleError(res,err,500);
                else {
                    var eventDate = new Date(conference[0].date);
                    var day = eventDate.getDate();
                    var month = eventDate.getMonth() + 1;
                    var year = eventDate.getFullYear();
                    var confDate = day + '/' + month + '/' + year;
                    var hour;
                    var minutes;
                    if(eventDate.getHours() < 10)
                        hour = '0' + eventDate.getHours();
                    else
                        hour = eventDate.getHours();
                    if(eventDate.getMinutes() < 10)
                        minutes = '0' + eventDate.getMinutes();
                    else
                        minutes = eventDate.getMinutes();
                    async.series([
                        function (callback) {
                            getUsersInMandrillFormat(conference[0].speakers,true).then(
                                function(newUsers){
                                    if(newUsers.length > 0){
                                        getMergeVars(newUsers).then(
                                            function(mergeVars){
                                                MailerModule.sendNotification(
                                                    "msd_users_notif",
                                                    [],
                                                    newUsers,
                                                    'Invitatie la conferinta ' + conference[0].name,
                                                    false,
                                                    confDate,
                                                    hour + ':' + minutes,
                                                    conference[0].name,
                                                    'speaker',
                                                    req.body.spkString,
                                                    'http://qconferences.qualitance.com',
                                                    mergeVars
                                                ).then(
                                                    function (success) {
                                                        LiveConference.aggregate([
                                                            {$match: {_id: mongoose.Types.ObjectId(req.query.id)}},
                                                            {$unwind: "$speakers"},
                                                            {$project: {
                                                                name: "$speakers.name",
                                                                username: "$speakers.username",
                                                                //isInvited: {$cond: {if: {$eq: ["$speakers.username", "user1"]}, then: true, else: false}}
                                                                invited: {$literal: true}
                                                            }
                                                            }
                                                        ], function (err, updatedSpeakers) {
                                                            if(err){
                                                                callback(err);
                                                            }else{
                                                                LiveConference.update({_id: req.query.id}, {'$set': {
                                                                    'speakers': updatedSpeakers
                                                                }}, function(err,wres) {
                                                                    if(err){
                                                                        callback(err);
                                                                    }
                                                                    else
                                                                        callback(success);
                                                                });
                                                            }
                                                        });

                                                    },
                                                    function (err) {
                                                        callback(err);
                                                    }
                                                );
                                            },
                                            function(err){
                                                callback(err);
                                            }
                                        );
                                    } else
                                        callback();
                                },
                                function(err){
                                    callback(err);
                                }
                            );
                        },
                        function (callback) {
                            getUsersInMandrillFormat(conference[0].viewers,true).then(
                                function(newUsers){
                                    if(newUsers.length > 0){
                                        getMergeVars(newUsers).then(
                                            function(mergeVars){
                                                MailerModule.sendNotification(
                                                    "msd_users_notif",
                                                    [],
                                                    newUsers,
                                                    'Invitatie la conferinta ' + conference[0].name,
                                                    false,
                                                    confDate,
                                                    hour + ':' + minutes,
                                                    conference[0].name,
                                                    'invitat',
                                                    req.body.spkString,
                                                    'http://qconferences.qualitance.com',
                                                    mergeVars
                                                ).then(
                                                    function (success) {
                                                        LiveConference.aggregate([
                                                            {$match: {_id: mongoose.Types.ObjectId(req.query.id)}},
                                                            {$unwind: "$viewers"},
                                                            {$project: {
                                                                name: "$viewers.name",
                                                                username: "$viewers.username",
                                                                //isInvited: {$cond: {if: {$eq: ["$speakers.username", "user1"]}, then: true, else: false}}
                                                                invited: {$literal: true}
                                                            }
                                                            }
                                                        ], function (err, updatedViewers) {
                                                            if(err){
                                                                callback(err);
                                                            }else{
                                                                LiveConference.update({_id: req.query.id}, {'$set': {
                                                                    'viewers': updatedViewers
                                                                }}, function(err,wres) {
                                                                    if(err){
                                                                        callback(err);
                                                                    }
                                                                    else
                                                                        callback(success);
                                                                });
                                                            }
                                                        });
                                                    },
                                                    function (err) {
                                                        callback(err);
                                                    }
                                                );
                                            },
                                            function(err){
                                                callback(err);
                                            }
                                        );
                                    } else {
                                        callback();
                                    }
                                },
                                function(err){
                                    callback(err);
                                }
                            );
                        }, function(callback) {
                            if(conference[0].moderator.username){
                                if(!conference[0].moderator.invited){
                                    MailerModule.sendNotification(
                                        "msd_users_notif",
                                        [],
                                        [{email: conference[0].moderator.username, name: conference[0].moderator.name}],
                                        'Invitatie la conferinta ' + conference[0].name,
                                        false,
                                        confDate,
                                        hour+ ':' + minutes,
                                        conference[0].name,
                                        'moderator',
                                        req.body.spkString,
                                        'http://qconferences.qualitance.com',
                                        [{
                                            "rcpt": conference[0].moderator.username,
                                            "vars": [{
                                                "name": "userName",
                                                "content": conference[0].moderator.name
                                            }]
                                        }]
                                    ).then(
                                        function (success) {
                                            LiveConference.update({_id: req.query.id}, {'$set': {
                                                    'moderator.invited': true
                                                }}, function(err,wres) {
                                                if(err)
                                                    callback(err);
                                                else
                                                    callback(success);
                                            });
                                        },
                                        function (err) {
                                            callback(err);
                                        }
                                    );
                                } else
                                    callback();
                            } else
                                callback();
                        }
                    ], function (err) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res);
                        }
                    });
                }
            });


        });

    router.route('/streamAdmin/therapeutic_areas')

        .get(function(req, res) {
            Therapeutic_Area.find({$query:{}, $orderby: {name: 1}}, function(err, cont) {
                if(err) {
                    handleError(res,err,500);
                }else
                    handleSuccess(res, cont);
            });
        });

    router.route('/streamAdmin/regexp')
        .get(function(req,res){
            var regexp = UtilsModule.validationStrings;
            handleSuccess(res,regexp);
        });

    app.use('/api', router);

};