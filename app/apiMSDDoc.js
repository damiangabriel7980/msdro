/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var jsonwebtoken = require('jsonwebtoken');
var url = require('url');


var NewsPost = require('./models/MSDDoc_news_post');
var Chat= require('./models/MSDDoc_chat');
var Messages= require('./models/MSDDoc_messages');
var User = require('./models/user');


//CONSTANTS
const defaultPageSize = 10;


module.exports = function(app, logger, tokenSecret, socketServer, router) {

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
    app.use('/apiMSDDoc', expressJwt({secret: tokenSecret}).unless({path: ['/apiMSDDoc/createAccount', '/apiMSDDoc/resetPass']}));


    //========================================================================================================================================== all routes


    //========    NEWS POST    =======//
    router.route('/newsPost')
        .get(function(req,res){
            if(req.query.id){
                var id=req.query.id;
                NewsPost.findOne({_id: id}).populate('owner').exec(function(err,result){
                    if(err)
                        res.json(err);
                    else
                        res.json(result);
                })
            }else{
                var pageSize=req.query.pageSize || defaultPageSize;
                var created = req.query.created;
                var q = {};
                if(created){
                    q['created'] = {$lt: new Date(created)};
                }
                NewsPost.find(q).sort({'last_updated' : -1}).limit(pageSize)
                    .exec(function(err, result) {
                        if(err)
                            res.json(err);
                        else
                            res.json(result);
                    });
            }
        })
    .post(function(req,res){
        var userData = getUserData(req);
        var MyNewsPost = new NewsPost();
        MyNewsPost.title=req.body.title;
        MyNewsPost.message=req.body.message;
        MyNewsPost.owner=userData._id;
        MyNewsPost.created= Date.now();
        MyNewsPost.save(function(err,saved){
            if(err)
                res.json(err);
            else
            {
                res.statusCode = 201;
                res.send(saved);
            }
        })
    });


    //========  MEDICS  =======//

    router.route('/medics')
        .get(function(req,res){
            var id = req.query.id;
            if(id){
                User.findOne({_id: id, visible:true}, 'name username birthday phone description').exec(function (err, user) {
                    if(err){
                        res.send(err);
                    }else if(user){
                        res.send(user);
                    }else{
                        res.statusCode = 404;
                        res.end();
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
                    if(err)
                        res.json(err);
                    else
                        res.json(result);
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
                if(err)
                    res.json(err);
                else
                    res.json(result);
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
                    res.send(err);
                }else{
                    res.send(saved);
                }
            });
        });


    //========    CHAT    =======//

    router.route('/chats')
        .get(function(req,res){
            var user = getUserData(req);
            var created=req.query.created;
            var pageSize=req.query.pageSize || defaultPageSize;
            var type=req.query.type;
            var q = {$or: [{sender: user._id}, {receiver: user._id}]};
            if(type==="topic"){
                q['post'] = {$exists: true, $ne: null};
            }else{
                q['post'] = null;
            }
            if(created){
                q['created'] = {"$lt": created};
            }
            Chat.find(q).sort({'created': -1}).limit(pageSize).exec(function(err, result) {
                if(err){
                    console.log(err);
                    res.json(err);
                }else{
                    res.json(result);
                }
            });
        })
        .post(function (req, res) {
            console.log(req.body);
            var userData = getUserData(req);

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
            }else if(type==="postBased"){
                toSave['post'] = postId;
                receiver = postOwner;
            }else{
                keepGoing = false;
                res.statusCode = 400;
                res.send({hasError: true, message: "invalid query params"});
            }

            if(keepGoing){
                toSave['participants'] = [sender, receiver];

                //form query object to be used later
                var q;
                if(type === "postBased"){
                    q = {participants: {$in: toSave['participants']}, post: postId};
                }else{
                    q = {participants: {$in: toSave['participants'], $size: 2}, post: null}
                }

                //check if a chat involving sender / receiver / post combination already exists
                Chat.findOne(q, function (err, found) {
                    if(err){
                        res.send(err);
                    }else if(found){
                        res.send(found);
                    }else{
                        toSave.save(function (err, saved) {
                            if(err){
                                res.send(err);
                            }else{
                                res.send(saved);
                            }
                        });
                    }
                });
            }
        })
        .put(function (req, res) {
            var keepGoing = true;

            var userData = getUserData(req);

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
                res.send({hasError: true, message: "Invalid params"});
            }
            if(keepGoing){
                Chat.update({_id: chatId}, upd, function (err, wres) {
                    if(err){
                        res.send(err);
                    }else{
                        res.send({hasError: false, message: "Update succeeded"});
                    }
                });
            }
        });

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
                                }
                            });
                        }else{
                            socket.disconnect('unauthorized');
                        }
                    });
                })
                .on('joinChat', function (chat_id) {
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
                .on('leaveChat', function (chat_id) {
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
                        socket.join(chat_id, function(err){
                            if(err){
                                socket.emit('apiMessage', {error: err, success: null});
                            }else{
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
                                        Chat.update({_id: chat_id}, {$addToSet: {participants: socket.userData._id}}, function (err, wres) {
                                            if(err){
                                                socket.emit('apiMessage', {error: err, success: null});
                                            }else{
                                                socket.to(chat_id).emit('newMessage', {error: null, success: saved});
                                                //send push notifications
                                                Chat.findOne({_id: chat_id}, function (err, chat) {
                                                    if(err){
                                                        console.log(err);
                                                    }else{
                                                        User.find({_id: {$in: chat.subscribers}, connectedToDOC: {$exists: true, $ne: false}}, function (err, users) {
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
                            }
                        });
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