/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var url = require('url');


var NewsPost = require('./models/MSDDoc_news_post');
var Chat= require('./models/MSDDoc_chat');
var Messages= require('./models/MSDDoc_messages');
var User = require('./models/user');


//CONSTANTS
const defaultPageSize = 10;


module.exports = function(app, logger, tokenSecret, router) {

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
        var MyNewsPost = new NewsPost();
        MyNewsPost.title=req.body.title;
        MyNewsPost.message=req.body.message;
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
                var q = {visible:true};
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
                    { "$limit": parseInt(pageSize) }
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

            var type = req.query.type;
            var user = req.body.user;
            var post = req.body.post;

            var toSave = new Chat({
                sender: userData._id,
                created: Date.now()
            });

            var keepGoing = true;

            if(type==="userBased"){
                toSave['post'] = null;
                toSave['receiver'] = user._id;
            }else if(type==="postBased"){
                toSave['post'] = post._id;
                toSave['receiver'] = post.owner;
            }else{
                res.send({hasError: true, message: "invalid query params"});
                keepGoing = false;
            }

            if(keepGoing){
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
        });

    app.use('/apiMSDDoc', router);
};