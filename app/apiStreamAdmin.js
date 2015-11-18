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
                LiveConference.find({_id:req.query.id}).populate('speakers.registered').populate('viewers.registered').populate('therapeutic-areasID').populate('moderator').exec(function (err, conference) {
                    if(err) { handleError(res, err); }
                    if(conference.length == 0) { handleError(res,err,404,1); }
                    else
                        handleSuccess(res,conference[0]);
                });
            } else {
                LiveConference.find().populate('speakers.registered viewers.registered').exec(function (err, conferences) {
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
                    if(userData.registered) {
                        LiveConference.update({_id: req.query.id}, {$pull: {'speakers.registered': userData.id}}, function (err, wRes) {
                            if(err){
                                handleError(res, err);
                            }else{
                                handleSuccess(res,{success: wRes});
                            }
                        });
                    } else {
                        LiveConference.update({_id: req.query.id}, {$pull: {'speakers.unregistered': {_id: userData.id}}}, function (err, wRes) {
                            if(err){
                                handleError(res, err);
                            }else{
                                handleSuccess(res,{success: wRes});
                            }
                        });
                    }
                }
                else {
                    if(userData.registered) {
                        LiveConference.update({_id: req.query.id}, {$pull: {'viewers.registered': userData.id}}, function (err, wRes) {
                            if(err){
                                handleError(res, err);
                            }else{
                                handleSuccess(res,{success: wRes});
                            }
                        });
                    } else {
                        LiveConference.update({_id: req.query.id}, {$pull: {'viewers.unregistered': {_id: userData.id}}}, function (err, wRes) {
                            if(err){
                                handleError(res, err);
                            }else{
                                handleSuccess(res,{success: wRes});
                            }
                        });
                    }
                }
            } else if(req.query.addSpeaker){
                if(req.query.single){
                    var patt = UtilsModule.regexes.email;
                    if(!patt.test(req.body.user.username.toString())){
                        handleError(res,null,400,31);
                    }else {
                        if(req.body.registered){
                            LiveConference.findOneAndUpdate({_id: req.query.id}, {$push: {'speakers.registered': req.body.user._id}}).exec(function (err, wRes) {
                                if (err) {
                                    handleError(res, err);
                                } else {
                                    handleSuccess(res, wRes);
                                }
                            });
                        }else {
                            LiveConference.findOneAndUpdate({_id: req.query.id}, {$push: {'speakers.unregistered': req.body.user}}).exec(function (err, wRes) {
                                if (err) {
                                    handleError(res, err);
                                } else {
                                    handleSuccess(res, wRes);
                                }
                            });
                        }
                    }
                } else {
                    LiveConference.findOneAndUpdate({_id: req.query.id}, {$set: {speakers: req.body}}).populate('speakers.registered').exec(function (err, wres) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res,wres);
                        }
                    });
                }
            } else if(req.query.addViewers){
                if(req.query.single){
                    var patt = UtilsModule.regexes.email;
                    if(!patt.test(req.body.username.toString())){
                        handleError(res,null,400,31);
                    }else {
                        LiveConference.findOneAndUpdate({_id: req.query.id}, {$push: {'viewers.unregistered': req.body}}).exec(function (err, wRes) {
                            if (err) {
                                handleError(res, err);
                            } else {
                                handleSuccess(res, wRes);
                            }
                        });
                    }
                } else {
                    LiveConference.findOneAndUpdate({_id: req.query.id}, {$set: {viewers: req.body}}).populate('viewers.registered').exec(function (err, wres) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res,wres);
                        }
                    });
                }

            }
            else
            {
                LiveConference.update({_id: req.query.id}, {$set: req.body}, function (err, wres) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res,{success: wres});
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

    router.route('/streamAdmin/users')
        .get(function(req,res){
            var data = {username: 1, name: 1};
            if(req.query.groups)
                data['groupsID'] = 1;
            User.find({}, data).populate('groupsID').limit(0).exec(function(err, cont) {
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

        .post(function(req, res) {
            var eventDate = new Date(req.body.conference.date);
            var day = eventDate.getDate();
            var month = eventDate.getMonth() + 1;
            var year = eventDate.getFullYear();
            var confDate = day + '/' + month + '/' + year;
            async.parallel([
                function (callback) {
                    async.each(req.body.usersToNotify.speakers,function(item,callback2){
                        MailerModule.sendNotification(
                            "msd_registered_users_notif",
                            [],
                            [{email: item.username, name: item.name}],
                            'Invitatie la conferinta ' + req.body.conference.name,
                            false,
                            item.name,
                            confDate,
                            eventDate.getHours() + ':' + eventDate.getMinutes(),
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
                    async.each(req.body.usersToNotify.viewers,function(item,callback2){
                        MailerModule.sendNotification(
                            "msd_registered_users_notif",
                            [],
                            [{email: item.username, name: item.name}],
                            'Invitatie la conferinta ' + req.body.conference.name,
                            false,
                            item.name,
                            confDate,
                            eventDate.getHours() + ':' + eventDate.getMinutes(),
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
                }
            ], function (err) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res);
                }
            });

        });

    router.route('/regexp')
        .get(function(req,res){
            var regexp = UtilsModule.validationStrings;
            handleSuccess(res,regexp);
        });

    app.use('/api', router);

};