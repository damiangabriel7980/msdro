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
                                            viewers.registered.push(cont[0]);
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
                LiveConference.findOneAndUpdate({_id: req.query.id}, {$set: req.body}, function (err, wres) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res,wres);
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


    router.route('/streamAdmin/sendNotification')

        .put(function (req,res) {
            var eventDate = new Date(req.body.conference.date);
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
                    async.eachSeries(req.body.usersToNotify.speakers,function(item,callback2){
                        MailerModule.sendNotification(
                            "msd_users_notif",
                            [],
                            [{email: item.username, name: item.name}],
                            'Actualizare date conferinta ' + req.body.conference.name,
                            true,
                            item.name,
                            confDate,
                            hour+ ':' + minutes,
                            req.body.conference.name,
                            'speaker',
                            req.body.spkString,
                            'http://qconferences.qualitance.com'
                        ).then(
                            function (success) {
                                callback2(success);
                            },
                            function (err) {
                                callback2(err);
                            }
                        );
                    }, function (err) {
                        if(err){
                            callback(err);
                        }else{
                            callback();
                        }
                    })
                },
                function (callback) {
                    async.eachSeries(req.body.usersToNotify.viewers,function(item,callback2){
                        MailerModule.sendNotification(
                            "msd_users_notif",
                            [],
                            [{email: item.username, name: item.name}],
                            'Actualizare date conferinta ' + req.body.conference.name,
                            true,
                            item.name,
                            confDate,
                            hour+ ':' + minutes,
                            req.body.conference.name,
                            'viewer',
                            req.body.spkString,
                            'http://qconferences.qualitance.com'
                        ).then(
                            function (success) {
                                callback2(success);
                            },
                            function (err) {
                                callback2(err);
                            }
                        );
                    }, function (err) {
                        if(err){
                            callback(err);
                        }else{
                            callback();
                        }
                    })
                },
                function (callback) {
                    async.eachSeries(req.body.usersToInvite.speakers,function(item,callback2){
                        MailerModule.sendNotification(
                            "msd_users_notif",
                            [],
                            [{email: item.username, name: item.name}],
                            'Invitatie la conferinta ' + req.body.conference.name,
                            false,
                            item.name,
                            confDate,
                            hour+ ':' + minutes,
                            req.body.conference.name,
                            'speaker',
                            req.body.spkString,
                            'http://qconferences.qualitance.com'
                        ).then(
                            function (success) {
                                callback2(success);
                            },
                            function (err) {
                                callback2(err);
                            }
                        );
                    }, function (err) {
                        if(err){
                            callback(err);
                        }else{
                            callback();
                        }
                    })
                },
                function (callback) {
                    async.eachSeries(req.body.usersToInvite.viewers,function(item,callback2){
                        MailerModule.sendNotification(
                            "msd_users_notif",
                            [],
                            [{email: item.username, name: item.name}],
                            'Invitatie la conferinta ' + req.body.conference.name,
                            false,
                            item.name,
                            confDate,
                            hour+ ':' + minutes,
                            req.body.conference.name,
                            'viewer',
                            req.body.spkString,
                            'http://qconferences.qualitance.com'
                        ).then(
                            function (success) {
                                callback2(success);
                            },
                            function (err) {
                                callback2(err);
                            }
                        );
                    }, function (err) {
                        if(err){
                            callback(err);
                        }else{
                            callback();
                        }
                    })
                },
                function(callback)
                {
                    if(req.body.usersToNotify.moderator.username){
                        MailerModule.sendNotification(
                            "msd_users_notif",
                            [],
                            [{email: req.body.usersToNotify.moderator.username, name: req.body.usersToNotify.moderator.name}],
                            'Actualizare date conferinta ' + req.body.conference.name,
                            true,
                            req.body.usersToNotify.moderator.name,
                            confDate,
                            hour+ ':' + minutes,
                            req.body.conference.name,
                            'moderator',
                            req.body.spkString,
                            'http://qconferences.qualitance.com'
                        ).then(
                            function (success) {
                                callback(success);
                            },
                            function (err) {
                                callback(err);
                            }
                        );
                    } else if (req.body.usersToInvite.moderator.username) {
                        MailerModule.sendNotification(
                            "msd_users_notif",
                            [],
                            [{email: req.body.usersToNotify.moderator.username, name: req.body.usersToNotify.moderator.name}],
                            'Invitatie la conferinta ' + req.body.conference.name,
                            false,
                            req.body.usersToNotify.moderator.name,
                            confDate,
                            hour+ ':' + minutes,
                            req.body.conference.name,
                            'moderator',
                            req.body.spkString,
                            'http://qconferences.qualitance.com'
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

        })

        .post(function(req, res) {
            var eventDate = new Date(req.body.conference.date);
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
                    async.eachSeries(req.body.usersToNotify.speakers,function(item,callback2){
                        MailerModule.sendNotification(
                            "msd_users_notif",
                            [],
                            [{email: item.username, name: item.name}],
                            'Invitatie la conferinta ' + req.body.conference.name,
                            false,
                            item.name,
                            confDate,
                            hour+ ':' + minutes,
                            req.body.conference.name,
                            'speaker',
                            req.body.spkString,
                            'http://qconferences.qualitance.com'
                        ).then(
                            function (success) {
                                callback2(success);
                            },
                            function (err) {
                                callback2(err);
                            }
                        );
                    }, function (err) {
                        if(err){
                            callback(err);
                        }else{
                            callback();
                        }
                    })
                },
                function (callback) {
                    async.eachSeries(req.body.usersToNotify.viewers,function(item,callback2){
                        MailerModule.sendNotification(
                            "msd_users_notif",
                            [],
                            [{email: item.username, name: item.name}],
                            'Invitatie la conferinta ' + req.body.conference.name,
                            false,
                            item.name,
                            confDate,
                            hour+ ':' + minutes,
                            req.body.conference.name,
                            'viewer',
                            req.body.spkString,
                            'http://qconferences.qualitance.com'
                        ).then(
                            function (success) {
                                callback2(success);
                            },
                            function (err) {
                                callback2(err);
                            }
                        );
                    }, function (err) {
                        if(err){
                            callback(err);
                        }else{
                            callback();
                        }
                    })
                }, function(callback) {
                if(req.body.usersToNotify.moderator.username){
                    MailerModule.sendNotification(
                        "msd_users_notif",
                        [],
                        [{email: req.body.usersToNotify.moderator.username, name: req.body.usersToNotify.moderator.name}],
                        'Invitatie la conferinta ' + req.body.conference.name,
                        false,
                        req.body.usersToNotify.moderator.name,
                        confDate,
                        hour+ ':' + minutes,
                        req.body.conference.name,
                        'moderator',
                        req.body.spkString,
                        'http://qconferences.qualitance.com'
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