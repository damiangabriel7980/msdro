/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var jsonwebtoken = require('jsonwebtoken');
var url = require('url');
var async = require('async');


var NewsPost = require('./models/MSDDoc_news_post');
var Chat= require('./models/MSDDoc_chat');
var Messages= require('./models/MSDDoc_messages');
var User = require('./models/user');

var amazon = require('../config/amazon')();
var UserModule = require('./modules/user');

//CONSTANTS
const defaultPageSize = 10;

module.exports = function(app, env, logger, tokenSecret, socketServer, router) {

    //=============================================Define variables
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);

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
    app.all("/apiMSDDoc/*", function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
        next();
    });

    // We are going to protect /apiConferences routes with JWT
    app.use('/apiMSDDoc', expressJwt({secret: tokenSecret}));

    // Get user data from token and place it on request
    app.all('/apiMSDDoc/*', function (req, res, next) {
        req.user = getUserData(req);
        next();
    });

    //========================================================================================================================================== all routes


    /**
     * @apiName Retrieve_NewsPost
     * @apiDescription Retrieve a news post / multiple news posts based on the create date
     * @apiGroup MSD_DOC
     * @api {get} /apiMSDDoc/newsPost/ Retrieve a news post / multiple news posts based on the create date
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {String} [pageSize] How many news posts we want to receive (for multiple news posts)
     * @apiParam {String} id The id of the news post (the other two parameters don't apply if used)
     * @apiParam {String} created The date the news post was created (for multiple news posts)
     * @apiExample {curl} Example usage:
     *     curl -i -H "Authorization: Bearer " http://localhost:8080/apiMSDDoc/newsPost?id=90cwwdadwadawf1&pageSize=10&created=08/22/2016
     * @apiSuccess {Object} response.success a news post object / multiple news posts objects
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message : "A message"
     *     }
     * @apiSuccessExample {json} Success-Response (without id):
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
    //========    NEWS POST    =======//
    router.route('/newsPost')
        .get(function(req,res){
            if(req.query.id){
                var id=req.query.id;
                NewsPost.findOne({_id: id}).populate('owner').exec(function(err,result){
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, result);
                    }
                })
            }else{
                var pageSize=req.query.pageSize || defaultPageSize;
                var created = req.query.created;
                var q = {};
                if(created){
                    q['created'] = {$lt: new Date(created)};
                }
                NewsPost.find(q).sort({'created' : -1}).limit(pageSize).populate('owner')
                    .exec(function(err, result) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res, result);
                        }
                    });
            }
        })
        /**
         * @apiName Create_News_Post
         * @apiDescription Create a news post
         * @apiGroup MSD_DOC
         * @api {post} /apiMSDDoc/newsPost/ Create a news post
         * @apiVersion 1.0.0
         * @apiPermission medic
         * @apiUse HeaderAuthorization
         * @apiParam {String} title The news post title
         * @apiParam {String} message The news post content
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -H "Authorization: Bearer " -d '{title: '', message: ''}' http://localhost:8080/apiMSDDoc/newsPost
         * @apiSuccess {Object} response.success the newly created news post object
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
    .post(function(req,res){
        var userData = req.user;
        var MyNewsPost = new NewsPost();
        MyNewsPost.title=req.body.title;
        MyNewsPost.message=req.body.message;
        MyNewsPost.owner=userData._id;
        MyNewsPost.created= Date.now();
        MyNewsPost.save(function(err,saved){
            if(err){
                handleError(res, err);
            }else{
                NewsPost.findOne({_id: saved._id}).populate('owner').exec(function (err, toReturn) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, toReturn, 0, 201);
                    }
                });
            }
        })
    });


    //========  MEDICS  =======//
    /**
     * @apiName Retrieve_Medics
     * @apiDescription Retrieve a medic / multiple medics
     * @apiGroup MSD_DOC
     * @api {get} /apiMSDDoc/medics/ Retrieve a medic / multiple medics
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {String} [pageSize] How many medics we want to receive (for multiple medics)
     * @apiParam {String} id The id of the medic (the other two parameters don't apply if used)
     * @apiParam {Number} skip How many medics we want to skip from the beginning of the query results
     * @apiExample {curl} Example usage:
     *     curl -i -H "Authorization: Bearer " http://localhost:8080/apiMSDDoc/medics?id=null&pageSize=10&skip=20
     * @apiSuccess {Object} response.success a medic object / multiple medic objects
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message : "A message"
     *     }
     * @apiSuccessExample {json} Success-Response (without id):
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
     * @apiUse EntityNotFound
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 404 EntityNotFound Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/medics')
        .get(function(req,res){
            var id = req.query.id;
            if(id){
                User.findOne({_id: id, visible:true}, 'name username birthday phone description').exec(function (err, user) {
                    if(err){
                        handleError(res, err);
                    }else if(user){
                        handleSuccess(res, user);
                    }else{
                        handleError(res, null, 404);
                    }
                });
            }else{
                var pageSize=req.query.pageSize || defaultPageSize;
                var skip = req.query.skip;
                //mongoose cannot sort strings case insensitive (in our case we need to sort by "name")
                //so we will use aggregate to project a lower case string of the "name", sort by it,
                //then at the end remove it from our projection
                var cursor = User.aggregate([
                    { "$match": {"visible": true} },
                    { "$project": {
                        "name": 1,
                        "username": 1,
                        "birthday": 1,
                        "phone": 1,
                        "description": 1,
                        "nameInsensitive": { "$toLower": "$name" }
                    }},
                    { "$sort": { "nameInsensitive": 1 } },
                    { "$skip": skip?parseInt(skip):0 },
                    { "$limit": parseInt(pageSize) },
                    { "$project": {
                        "name": 1,
                        "username": 1,
                        "birthday": 1,
                        "phone": 1,
                        "description": 1
                    } }
                ]);
                cursor.exec(function(err, result) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, result);
                    }
                });
            }
        });


    //========   MESSAGES   =======//

    router.route('/messages')
        .get(function(req,res){
            var chatId = req.query.chatId;
            var pageSize=req.query.pageSize || defaultPageSize;
            var created = req.query.created;
            var q = {chat: chatId};
            if(created){
                q['created'] = {$lt: new Date(created)};
            }
            Messages.find(q).sort({created: -1}).limit(pageSize).exec(function(err, result) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, result);
                }
            });
        })
        .post(function (req, res) {
            var chatId = mongoose.Types.ObjectId(req.body.chatId);
            var text = req.body.text;
            var toSave = new Messages({
                chat: chatId,
                text: text,
                created: Date.now()
            });
            toSave.save(function (err, saved) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, saved);
                }
            });
        });


    //========    CHAT    =======//

    router.route('/chats')
    /**
     * @apiName Retrieve_Chats
     * @apiDescription Retrieve a list of chats the current user has participated
     * @apiGroup MSD_DOC
     * @api {get} /apiMSDDoc/chats/ Retrieve a list of chats the current user has participated
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {String} [pageSize] How many medics we want to receive (for multiple medics)
     * @apiParam {String} created Filter chats by the created date
     * @apiParam {String} type The type of a chat (can be null or 'topic')
     * @apiExample {curl} Example usage:
     *     curl -i -H "Authorization: Bearer " http://localhost:8080/apiMSDDoc/chats?type=topic&pageSize=10&created=22/08/2016
     * @apiSuccess {Array} response.success A list of chats
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
        .get(function(req,res){
            var user = req.user;
            var created=req.query.created;
            var pageSize=req.query.pageSize || defaultPageSize;
            var type=req.query.type;
            var q = {participants: {$in: [mongoose.Types.ObjectId(user._id.toString())]}};
            if(type==="topic"){
                q['post'] = {$exists: true, $ne: null};
            }else{
                q['post'] = null;
            }
            if(created){
                q['created'] = {"$lt": created};
            }
            Chat.find(q).sort({'created': -1}).limit(pageSize).deepPopulate('participants last_message post.owner').exec(function(err, result) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, result);
                }
            });
        })
        /**
         * @apiName Create_Chat_Thread
         * @apiDescription Create a chat thread
         * @apiGroup MSD_DOC
         * @api {post} /apiMSDDoc/chats/ Create a chat thread
         * @apiVersion 1.0.0
         * @apiPermission medic
         * @apiUse HeaderAuthorization
         * @apiParam {String} userId The id of the user creating the chat
         * @apiParam {String} postId The id of the news post we want to create a chat
         * @apiParam {String} postOwner The owner of the post
         * @apiParam {String} type The type of a chat (can be null, 'userBased' or 'postBased')
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -H "Authorization: Bearer " -d '{userId: '', postId: '', postOwner: '', type: ''}' http://localhost:8080/apiMSDDoc/chats
         * @apiSuccess {Object} response.success The newly created chat
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
         * @apiUse BadRequest
         * @apiErrorExample {json} Error-Response (4xx):
         *     HTTP/1.1 400 BadRequest Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function (req, res) {
            var userData = req.user;

            var keepGoing = true;

            //params
            var type = req.query.type;
            var userId = mongoose.Types.ObjectId(req.body.userId);
            var postId = mongoose.Types.ObjectId(req.body.postId);
            var postOwner = mongoose.Types.ObjectId(req.body.postOwner);

            //init sender and receiver
            var sender = mongoose.Types.ObjectId(userData._id);
            var receiver;

            var toSave = new Chat({
                created: Date.now()
            });

            if(type==="userBased"){
                toSave['post'] = null;
                receiver = userId;
                if(!userId) keepGoing = false;
            }else if(type==="postBased"){
                toSave['post'] = postId;
                receiver = postOwner;
                if(!postId || !postOwner) keepGoing = false;
            }else{
                keepGoing = false;
            }

            if(keepGoing){
                if(sender.toString() == receiver.toString()){
                    toSave['participants'] = [sender];
                }else{
                    toSave['participants'] = [sender, receiver];
                }

                //form query object to be used later
                var q;
                if(type === "postBased"){
                    q = {participants: {$in: toSave['participants']}, post: postId};
                }else{
                    q = {participants: {$in: toSave['participants'], $size: 2}, post: null}
                }

                //check if a chat involving sender / receiver / post combination already exists
                Chat.findOne(q).deepPopulate('participants last_message post.owner').exec(function (err, found) {
                    if(err){
                        handleError(res, err);
                    }else if(found){
                        handleSuccess(res, found);
                    }else{
                        toSave.save(function (err, saved) {
                            if(err){
                                handleError(res, err);
                            }else{
                                Chat.findOne({_id: saved._id}).deepPopulate('participants last_message post.owner').exec(function (err, toReturn) {
                                    if(err){
                                        handleError(res, err);
                                    }else{
                                        handleSuccess(res, toReturn);
                                    }
                                });
                            }
                        });
                    }
                });
            }else{
                handleError(res, null, 400);
            }
        })
        /**
         * @apiName Subscribe_Unsubscribe_Chat_Thread
         * @apiDescription Subscribe / un-subscribe to a chat thread
         * @apiGroup MSD_DOC
         * @api {put} /apiMSDDoc/chats/ Subscribe / un-subscribe to a chat thread
         * @apiVersion 1.0.0
         * @apiPermission medic
         * @apiUse HeaderAuthorization
         * @apiParam {String} chatId The id of the chat
         * @apiParam {Boolean} subscribe If true, the user will subscribe to a chat thread
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -H "Authorization: Bearer " http://localhost:8080/apiMSDDoc/chats?chatId=21nf387r32rn23ndf&subscribe=true
         * @apiSuccess {Object} response.success An empty object
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
         * @apiUse BadRequest
         * @apiErrorExample {json} Error-Response (4xx):
         *     HTTP/1.1 400 BadRequest Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .put(function (req, res) {
            var keepGoing = true;

            var userData = req.user;

            var chatId = mongoose.Types.ObjectId(req.query.chatId);
            var subscribe = req.query.subscribe;

            //set update type
            var upd;
            if(subscribe === "true"){
                upd = {$addToSet: {subscribers: userData._id}};
            }else if(subscribe === "false"){
                upd = {$pull: {subscribers: userData._id}};
            }else{
                keepGoing = false;
                handleError(res, null, 400);
            }
            if(keepGoing){
                Chat.update({_id: chatId}, upd, function (err, wres) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res);
                    }
                });
            }
        });

    //========    IMAGES    =======//

    var getFile = function (req) {
        if(req.files && req.files.file && req.files.file.originalname && req.files.file.buffer){
            return {
                extension: req.files.file.originalname.split(".").pop(),
                buffer: req.files.file.buffer
            };
        }else{
            return null;
        }
    };

    router.route('/image/profile')
        /**
         * @apiName Update_Profile_Image
         * @apiDescription Update user profile picture
         * @apiGroup MSD_DOC
         * @api {post} /apiMSDDoc/image/profile Update user profile picture
         * @apiVersion 1.0.0
         * @apiPermission medic
         * @apiUse HeaderAuthorization
         * @apiParam {String} files.file The image file
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -H "Authorization: Bearer " --data-binary "@path/to/file" http://localhost:8080/apiMSDDoc/image/profile
         * @apiSuccess {Object} response.success An object containing the path to the image
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
         * @apiUse EntityNotFound
         * @apiErrorExample {json} Error-Response (4xx):
         *     HTTP/1.1 404 EntityNotFound Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function (req, res) {
            var file = getFile(req);
            if(file){
                UserModule.updateUserImage(req.user._id, file.buffer, file.extension).then(
                    function (image_path) {
                        handleSuccess(res, image_path);
                    },
                    function (error) {
                        handleError(res, error);
                    }
                );
            }else{
                handleError(res, null, 404);
            }
        });

    router.route('/image/newspost')
        /**
         * @apiName News_Post_Image
         * @apiDescription Attach a image to a news post
         * @apiGroup MSD_DOC
         * @api {post} /apiMSDDoc/image/newspost Attach a image to a news post
         * @apiVersion 1.0.0
         * @apiPermission medic
         * @apiUse HeaderAuthorization
         * @apiParam {String} files.file The image file
         * @apiParam {String} id The id of the news post
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -H "Authorization: Bearer " --data-binary "@path/to/file" http://localhost:8080/apiMSDDoc/image/newspost?id=du8awd822313fnnf
         * @apiSuccess {Object} response.success An object containing the path to the image
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
         * @apiUse BadRequest
         * @apiErrorExample {json} Error-Response (4xx):
         *     HTTP/1.1 400 BadRequest Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function (req, res) {
            //get necessary params
            var file = getFile(req);
            var newspost_id = req.query.id;
            if(file && newspost_id){
                //find the newspost
                NewsPost.findOne({_id: newspost_id, owner: req.user._id}, function (err, newspost) {
                    if(err){
                        handleError(res, err);
                    }else if(!newspost){
                        handleError(res, null, 404);
                    }else{
                        //memorise current image path for deleting it at the end
                        var oldImage = newspost.image_path;
                        //form s3 key
                        var key = "MSD_Doc/newsposts/"+newspost._id+"/image."+file.extension;
                        //upload new image
                        amazon.addObjectS3(key, file.buffer, function (err, success) {
                            if(err){
                                handleError(res, err);
                            }else{
                                //save path to DB
                                newspost.image_path = key;
                                newspost.save(function (err, newspost) {
                                    if(err){
                                        handleError(res, err);
                                    }else{
                                        handleSuccess(res, newspost.image_path);
                                        //remove old image; careful not to remove the newly added one
                                        if(oldImage && oldImage != key) amazon.deleteObjectS3(oldImage);
                                    }
                                });
                            }
                        });
                    }
                });
            }else{
                handleError(res, null, 400);
            }
        });

//    router.route('/image')
//        .post(function (req, res) {
//            var user = req.user;
//            var type = req.query.type;
//            var collection;
//            if(type === "newspost"){
//                collection = NewsPost;
//            }else if(type === "profile"){
//                collection = User;
//            }else if(type === "chat"){
//                collection = Chat;
//            }else{
//                res.statusCode = 400;
//                return res.send({error: "Invalid type"});
//            }
//            //upload image
//            if(req.files && req.files.file){
//                if()
//            }else{
//                res.statusCode = 400;
//                return res.send({error: "File not found"});
//            }
//        });

    //============================================================================================================= SOCKET COMM

    var io = require('socket.io')(socketServer);

    var isAuth = function (socket) {
        if(socket.auth){
            return true;
        }else{
            socket.disconnect('unauthorized');
            return false;
        }
    };

    var rooms = {};

    // set namespace for socket.io
    var sockets = io.of('/doc');
    sockets
        .on('connection', function(socket){
            socket.auth = false;
            socket
                .on('authenticate', function(data){
                    //check the auth data sent by the client
                    jsonwebtoken.verify(data.token, tokenSecret, function(err, decoded) {
                        if (!err && decoded){
                            socket.userData = decoded;
                            console.log("================================== socket authenticated");
                            console.log("Socket: ", socket.id);
                            console.log("User: ", socket.userData.username);
                            User.update({_id:decoded._id}, {$set: {connectedToDoc: true}}, function (err, wres) {
                                if(err){
                                    socket.emit('apiMessage', {error: err, success: null});
                                }else{
                                    socket.auth = true;
                                    socket.emit('authenticated', {});
                                    //join rooms
                                    Chat.find({participants: {$in: [socket.userData._id]}}).exec(function (err, chats) {
                                        if(err){
                                            socket.emit('apiMessage', {error: err, success: null});
                                        }else{
                                            async.each(chats, function (chat, callback) {
                                                socket.join(chat._id.toString(), function (err) {
                                                    if(err){
                                                        callback(err);
                                                    }else{
                                                        callback();
                                                    }
                                                });
                                            }, function (err) {
                                                if(err){
                                                    socket.emit('apiMessage', {error: err, success: null});
                                                }else{
                                                    socket.emit('apiMessage', {error: null, success: "Joined all rooms"});
                                                }
                                            })
                                        }
                                    });
                                }
                            });
                        }else{
                            socket.disconnect('unauthorized');
                        }
                    });
                })
                .on('joinChat', function (data) {
                    var chat_id = data.chat_id;
                    if(isAuth(socket)){
                        socket.join(chat_id, function(err){
                            if(err){
                                socket.emit('apiMessage', {error: err, success: null});
                            }else{
                                socket.emit('apiMessage', {error: null, success: "Joined chat "+chat_id});
                            }
                        });
                    }
                })
                .on('leaveChat', function (data) {
                    var chat_id = data.chat_id;
                    if(isAuth(socket)){
                        socket.leave(chat_id, function(err){
                            if(err){
                                socket.emit('apiMessage', {error: err, success: null});
                            }else{
                                socket.emit('apiMessage', {error: null, success: "Left chat "+chat_id});
                            }
                        });
                    }
                })
                .on('message', function (data) {
                    if(isAuth(socket)){
                        var chat_id = mongoose.Types.ObjectId(data.id);
                        var text = data.text;
                        //check if socket is in this room
                        if(socket.rooms.indexOf(chat_id.toString()) > -1){
                            var newMessage = new Messages({
                                chat: chat_id,
                                text: text,
                                owner: socket.userData._id,
                                created: Date.now()
                            });
                            newMessage.save(function (err, saved) {
                                if(err){
                                    socket.emit('apiMessage', {error: err, success: null});
                                }else{
                                    Chat.update({_id: chat_id}, {$addToSet: {participants: socket.userData._id}, last_message: saved._id}, function (err, wres) {
                                        if(err){
                                            socket.emit('apiMessage', {error: err, success: null});
                                        }else{
                                            sockets.to(chat_id.toString()).emit('newMessage', {error: null, success: saved});
                                            //send push notifications
                                            Chat.findOne({_id: chat_id}, function (err, chat) {
                                                if(err){
                                                    console.log(err);
                                                }else{
                                                    User.find({_id: {$in: chat.subscribers}, connectedToDOC: {$exists: true, $ne: false}}, {_id: 1}, function (err, users) {
                                                        if(err){
                                                            console.log(err);
                                                        }else{
                                                            console.log("!!! === TODO: Send push notifications to users:");
                                                            console.log(users);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }else{
                            socket.emit('apiMessage', {error: "Not in room "+chat_id.toString(), success: null});
                        }
                    }
                })
                .on('test', function (data) {
                    if(isAuth(socket)){
                        socket.join('myRoom');
                        console.log(sockets.connected);
                    }
                })
                .on('disconnect', function () {
                    User.update({_id: socket.userData._id}, {$set: {connectedToDOC: false}}, function (err, wres) {
                        if(err){
                            console.log(err);
                        }else{
                            console.log("================================== socket disconnected");
                        }
                    });
                });
        });

    app.use('/apiMSDDoc', router);
};