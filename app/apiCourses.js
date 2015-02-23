var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var User = require('./models/user');

var courses = require('./models/courses');

module.exports = function(app, logger, tokenSecret, router) {

    //access control allow origin *
    app.all("/apiCourses/*", function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
        next();
    });

    // We are going to protect /apiCourses routes with JWT
    app.use('/apiCourses', expressJwt({secret: tokenSecret}));

    //make sure that the user has admin rights
    var isAdmin = function (req, res, next) {
        console.log("check admin");
        //get data from token
        var token;
        try{
            token = req.headers.authorization.split(' ').pop();
            var userData = jwt.decode(token);
            User.findOne({_id: userData._id}, {rolesID: 1}).populate('rolesID').exec(function (err, user) {
                if(err || !user){
                    logger.error(err);
                    console.log(err);
                    res.statusCode = 403;
                    res.end();
                }else{
                    var roles = [];
                    for(var i=0; i<user.rolesID.length; i++){
                        roles.push(user.rolesID[i].authority);
                    }
                    if(roles.indexOf("ROLE_ADMIN") > -1){
                        next();
                    }else{
                        res.statusCode = 403;
                        res.end();
                    }
                }
            });
        }catch(ex){
            console.log(ex);
            logger.error(ex);
            res.statusCode = 403;
            res.end();
        }
    };

//===================================================================================================================== create account

    router.route('/courses')
        .get(function (req, res) {
            if(req.query.id){
                courses.findOne({_id: req.query.id}, function (err, course) {
                    if(err){
                        logger.error(err);
                        res.send({error: "Error retrieving course"});
                    }else{
                        res.send({success: course});
                    }
                });
            }else{
                courses.find({}, function (err, courses) {
                    if(err){
                        logger.error(err);
                        res.send({error: "Error retrieving courses"});
                    }else{
                        res.send({success: courses});
                    }
                });
            }
        })
        .post(isAdmin, function (req, res) {
            var name = req.body.name;
            var content = req.body.content;
            if(!name || !content){
                res.send({error: "Could not find name and content attributes on request body. These are mandatory"});
            }else{
                try{
                    content = JSON.parse(content);
                    var toAdd = new courses({
                        name: name,
                        content: content,
                        last_updated: Date.now()
                    });
                    toAdd.save(function (err, saved) {
                        if(err){
                            logger.error(err);
                            res.send({error: "Error at saving course"});
                        }else{
                            res.send({success: saved});
                        }
                    });
                }catch(ex){
                    res.send({error: "Error parsing content"});
                }
            }
        })
        .put(isAdmin, function (req, res) {
            var id = req.query.id;
            var data = req.body;
            if(!id) {
                res.send({error: "Invalid query params. Missing id"});
            }else if(!data.content) {
                res.send({error: "Invalid request body. Missing content attribute, which is mandatory"});
            }else{
                try{
                    data.content = JSON.parse(data.content);
                    data.last_updated = Date.now();
                    courses.update({_id: req.query.id}, {$set: data}, function (err, wres) {
                        if(err){
                            console.log(err);
                            logger.error(err);
                            res.send({error: "Error updating course"});
                        }else{
                            courses.findOne({_id: req.query.id}, function (err, course) {
                                if(err){
                                    logger.error(err);
                                    res.send({error: "Error retrieving course"});
                                }else{
                                    res.send({success: course});
                                }
                            });
                        }
                    });
                }catch(ex){
                    res.send({error: "Error parsing content"});
                }
            }
        })
        .delete(isAdmin, function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            if(idToDelete){
                courses.remove({_id: idToDelete}, function (err, wRes) {
                    if(err){
                        logger.error(err);
                        res.send({error: "Error removing course"});
                    }else if(wRes == 0){
                        res.send({error: "No document found matching the id"});
                    }else{
                        res.send({success: "Removed "+wRes+" course"});
                    }
                });
            }else{
                res.send({error: "Invalid query params. Missing id"});
            }
        });

    app.use('/apiCourses', router);
};