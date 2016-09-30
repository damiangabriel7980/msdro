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
    /**
     * @apiName Retrieve_Conferences
     * @apiDescription Retrieve a list of conferences or a single conference
     * @apiGroup Live_Conferences
     * @api {get} /api/streamAdmin/liveConferences Retrieve a list of conferences or a single conference
     * @apiVersion 1.0.0
     * @apiPermission streamAdmin
     * @apiParam {String} [id] An id for the conference
     * @apiParam {Boolean} [separatedViewers] if we wish to receive the associated viewers
     * @apiExample {curl} Example usage (with id):
     *     curl -i  http://localhost:8080/api/streamAdmin/liveConferences?id=owkdoad9w912121&separatedViewers=true
     * @apiExample {curl} Example usage (without id):
     *     curl -i  http://localhost:8080/api/streamAdmin/liveConferences
     * @apiSuccess {Array} response.success an array of live conferences / an object with a specific conference
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response (without id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message : "A message"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse EntityNotFound
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 4xx EntityNotFound Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Create_Conference
         * @apiDescription Create a conference
         * @apiGroup Live_Conferences
         * @api {post} /api/streamAdmin/liveConferences Create a conference
         * @apiVersion 1.0.0
         * @apiPermission streamAdmin
         * @apiParam {Object} conferenceObj A conference object (based on liveConferences model)
         * @apiExample {curl} Example usage (with id):
         *     curl -i -X POST -d 'conferenceObject'  http://localhost:8080/api/streamAdmin/liveConferences
         * @apiSuccess {Object} response.success an object with the newly created conference
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response :
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message : "A message"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function(req,res){
            req.body.last_modified = new Date();
            LiveConference.create(req.body, function(err, conference) {
                if(err) { return handleError(res, err); }
                return handleSuccess(res,conference);
            });
        })
        /**
         * @apiName Update_Conference
         * @apiDescription Update a conference
         * @apiGroup Live_Conferences
         * @api {put} /api/streamAdmin/liveConferences Update a conference
         * @apiVersion 1.0.0
         * @apiPermission streamAdmin
         * @apiParam {String} id The id of the conference
         * @apiParam {Boolean} [isEnabled] The current status of a conference (true=enabled)
         * @apiParam {Boolean} [updateImage] If we want to update a conference's image
         * @apiParam {String} [image_path] The new Amazon path for the image previously mentioned
         * @apiParam {Boolean} [removeUser] If we want to remove a user from a conference
         * @apiParam {Object} [userObject] An object containing a user model.
         * @apiParam {Boolean} [addSpeaker] If we want to add a speaker (use previous user param for creating the user).
         * @apiParam {Boolean} [addViewers] If we want to add a viewer (use previous user param for creating the user).
         * @apiParam {Object} moderator An object containing a user model.
         * @apiExample {curl} Example usage:
         *     curl -i -X PUT -d '{isEnabled: '', image_path: '', userObject : {}, moderator: {}}'
         *     http://localhost:8080/api/streamAdmin/liveConferences?id=okwdoai923913njff&updateImage=false&removeUser=false&addSpeaker=false&addViewers=false
         * @apiSuccess {Number} response.success the number of conferences that were updated
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response :
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *           1
         *        },
         *        message : "A message"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         * @apiUse EntityNotFound
         * @apiErrorExample {json} Error-Response (4xx):
         *     HTTP/1.1 4xx EntityNotFound Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Conference
         * @apiDescription Delete a conference
         * @apiGroup Live_Conferences
         * @api {delete} /api/streamAdmin/liveConferences Delete a conference
         * @apiVersion 1.0.0
         * @apiPermission streamAdmin
         * @apiParam {String} id The id of the conference
         * @apiExample {curl} Example usage:
         *     curl -i -X DELETE  http://localhost:8080/api/streamAdmin/liveConferences?id=jdnwadw7871231b3b
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response :
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message : "A message"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Check_Email
     * @apiDescription Check if a user already exists / if the email address is valid
     * @apiGroup Live_Conferences
     * @api {delete} /api/streamAdmin/checkEmail Check if a user already exists / if the email address is valid
     * @apiVersion 1.0.0
     * @apiPermission streamAdmin
     * @apiParam {String} username The email of the user
     * @apiParam {Boolean} [checkIfExists] If we want to check if the user exists
     * @apiParam {Boolean} [checkEmailAddress] If we want to verify an email address
     * @apiExample {curl} Example usage:
     *     curl -i -X POST -d '{username: "john@test.com"}' http://localhost:8080/api/streamAdmin/checkEmail?checkIfExists=true&checkEmailAddress=false
     * @apiSuccess {Array} response.success a list of users / an empty object
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response (checkIfExists):
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message : "A message"
     *     }
     * @apiSuccessExample {json} Success-Response (checkEmailAddress) :
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse BadRequest
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 4xx BadRequest Error
     *     {
     *
     *     }
     */
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

    /**
     * @apiName User_List
     * @apiDescription Retrieve a list of users
     * @apiGroup Live_Conferences
     * @api {get} /api/streamAdmin/users Retrieve a list of users
     * @apiVersion 1.0.0
     * @apiPermission streamAdmin
     * @apiParam {Boolean} groups If we want to retrieve the user's groups
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/streamAdmin/users?groups=true
     * @apiSuccess {Array} response.success a list of users
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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

    /**
     * @apiName User_Groups
     * @apiDescription Retrieve a list of user groups
     * @apiGroup Live_Conferences
     * @api {get} /api/streamAdmin/groups Retrieve a list of user groups
     * @apiVersion 1.0.0
     * @apiPermission streamAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/streamAdmin/groups
     * @apiSuccess {Array} response.success a list of groups
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Send_Conference_Updates_Notification
     * @apiDescription Send email to notify users for changes in a conference
     * @apiGroup Live_Conferences
     * @api {put} /api/streamAdmin/sendNotification Send email to notify users for changes in a conference
     * @apiVersion 1.0.0
     * @apiPermission streamAdmin
     * @apiParam {String} conferencesStateURL The URL to access the conference in medic section
     * @apiParam {String} id The id of the conference
     * @apiParam {String} spkString A string containing the names of the speakers
     * @apiExample {curl} Example usage:
     *     curl -i -x PUT -d '{conferencesStateURL: 'someURL', spkString: 'speakersString'}' http://localhost:8080/api/streamAdmin/sendNotification?id=dnwuadhw71723163bd
     * @apiSuccess {Object} response.success an empty object
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
                                                'http://' + req.headers.host + req.body.conferencesStateURL,
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
                                                'http://' + req.headers.host + req.body.conferencesStateURL,
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
                                    'http://' + req.headers.host + req.body.conferencesStateURL,
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
        /**
         * @apiName Send_Conference_Invitation
         * @apiDescription Send email to invite users to participate at a conference
         * @apiGroup Live_Conferences
         * @api {post} /api/streamAdmin/sendNotification Send email to invite users to participate at a conference
         * @apiVersion 1.0.0
         * @apiPermission streamAdmin
         * @apiParam {String} conferencesStateURL The URL to access the conference in medic section
         * @apiParam {String} id The id of the conference
         * @apiParam {String} spkString A string containing the names of the speakers
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -d '{conferencesStateURL: 'someURL', spkString: 'speakersString'}' http://localhost:8080/api/streamAdmin/sendNotification
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message : "A message"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
                                                    'http://' + req.headers.host + req.body.conferencesStateURL,
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
                                                    'http://' + req.headers.host + req.body.conferencesStateURL,
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
                                        'http://' + req.headers.host + req.body.conferencesStateURL,
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

    /**
     * @apiName Therapeutic_areas
     * @apiDescription Retrieve a list of therapeutic areas
     * @apiGroup Live_Conferences
     * @api {get} /api/streamAdmin/therapeutic_areas Retrieve a list of therapeutic areas
     * @apiVersion 1.0.0
     * @apiPermission streamAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/streamAdmin/therapeutic_areas
     * @apiSuccess {Array} response.success a list of therapeutic areas
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/streamAdmin/therapeutic_areas')

        .get(function(req, res) {
            Therapeutic_Area.find({$query:{}, $orderby: {name: 1}}, function(err, cont) {
                if(err) {
                    handleError(res,err,500);
                }else
                    handleSuccess(res, cont);
            });
        });

    /**
     * @apiName Regexp
     * @apiDescription Retrieve the regexp validation strings from back-end
     * @apiGroup Live_Conferences
     * @api {get} /api/streamAdmin/regexp Retrieve the regexp validation strings from back-end
     * @apiVersion 1.0.0
     * @apiPermission streamAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/streamAdmin/regexp
     * @apiSuccess {Array} response.success an object containing the validation strings
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message : "A message"
     *     }
     */
    router.route('/streamAdmin/regexp')
        .get(function(req,res){
            var regexp = UtilsModule.validationStrings;
            handleSuccess(res,regexp);
        });

    app.use('/api', router);

};