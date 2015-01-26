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
            console.log(req.query);
            if(req.query.id){
                var id=req.query.id;
                Chat.findOne({post_id: id}).populate('messages',{ sort: { 'last_updated': 1 } }).populate('post').populate('participants').exec(function(err,result){
                    if(err)
                        res.json(err);
                    else
                        res.json(result);
                })
            }else if(req.query.pageSize){
                var pageSize=req.query.pageSize;
                var created = req.query.created;
                var q = {};
                if(created){
                    q['last_updated'] = {$lt: new Date(created)};
                }
                NewsPost.find(q).sort({'last_updated' : -1}).limit(pageSize)
                    .exec(function(err, result) {
                        if(err)
                            res.json(err);
                        else
                            res.json(result);
                    });
            } else {
                res.send({hasError: true, text: "Invalid params"});
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
                res.send({status:200, saved: saved});

            }
        })
    });

    //========get Medics paginated=======//

//    router.route('/getMedics/:pageSize')
//        .get(function(req,res){
//            var pageSize = req.params.pageSize;
//            User.find({visible:true},'name username birthday phone description').sort({'last_updated': -1}).limit(pageSize)
//                .exec(function(err, result) {
//                    if(err)
//                        res.json(err);
//                    else
//                        res.json(result);
//                });
//        });
//    router.route('/getMedicsPaginated/:pageSize/:skip')
//        .get(function(req,res){
//            var pageSize = req.params.pageSize;
//            var skipMedics = req.params.skip;
//            console.log(pageSize);
//            console.log(skipMedics);
//            User.find({visible:true},'name username birthday phone description').sort({'last_updated': -1}).skip(skipMedics).limit(pageSize)
//                .exec(function(err, result) {
//                    if(err)
//                        res.json(err);
//                    else
//                        res.json(result);
//                });
//        });
//    router.route('/getMedics/:id')
//        .get(function(req,res){
//            var id = req.params.id;
//            User.findOne({_id: id},'name username birthday phone description').populate('jobsID').exec(function(err, result) {
//                    if(err)
//                        res.json(err);
//                    else
//                        res.json(result);
//                });
//        });

    //========Get messages by topic/conversations=======//


//    router.route('/getMessagesByTopics')
//        .get(function(req,res){
//            var id = req.user._id;
//            chatDoc.find({post_id: {'$ne': null },chat_sender: id}).populate('post_id').exec(function(err, result) {
//                if(err)
//                    res.json(err);
//                else
//                    res.json(result);
//            });
//        });
//
//    router.route('/getMessagesByTopicsForPost/:created/:pageSize/:postID')
//        .get(function(req,res){
//            var id = req.user._id;
//            var created=req.params.created;
//            var pagesize=req.params.pageSize;
//            var postID= req.params.postID;
//            chatDoc.find({post_id: postID}).populate({path:'message_ids',options:{ sort: { 'last_updated': -1 },last_updated: {$lt: created},limit: pagesize }}).populate('post_id').exec(function(err, result) {
//                if(err)
//                    res.json(err);
//                else
//                    res.json(result);
//            });
//        });


    //========    CHAT    =======//

    router.route('/chats')
        .get(function(req,res){
            var user = getUserData(req);
            var created=req.query.created;
            var pageSize=req.query.pageSize;
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
            Chat.find(q).populate("messages").sort({'created': -1}).limit(pageSize).exec(function(err, result) {
                if(err){
                    console.log(err);
                    res.json(err);
                }else{
                    res.json(result);
                }
            });
        })
        .post(function (req, res) {
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