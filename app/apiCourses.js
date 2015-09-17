var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var User = require('./models/user');

var courses = require('./models/elearning/courses');

module.exports = function(app, logger, tokenSecret, router) {

    //=============================================Define variables
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);

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
        
        //get data from token
        var token;
        try{
            token = req.headers.authorization.split(' ').pop();
            var userData = jwt.decode(token);
            User.findOne({_id: userData._id}, {rolesID: 1}).populate('rolesID').exec(function (err, user) {
                if(err || !user){
                    handleError(res, err, 403);
                }else{
                    var roles = [];
                    for(var i=0; i<user.rolesID.length; i++){
                        roles.push(user.rolesID[i].authority);
                    }
                    if(roles.indexOf("ROLE_ADMIN") > -1){
                        next();
                    }else{
                        handleError(res, null, 403);
                    }
                }
            });
        }catch(ex){
            handleError(res, ex, 403);
        }
    };


    //=================================================================================================================== ROUTES FOR E-LEARNING
    router.route('/courses')
        .get(function (req, res) {
            if(req.query.id){
                courses.findOne({_id: req.query.id}, function (err, course) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, course);
                    }
                });
            }else{
                courses.find({}, function (err, courses) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, courses);
                    }
                });
            }
        })
        .post(isAdmin, function (req, res) {
            var name = req.body.name;
            var content = req.body.content;
            if(!name || !content){
                handleError(res, null, 400, 6);
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
                            handleError(res, err);
                        }else{
                            handleSuccess(res, saved);
                        }
                    });
                }catch(ex){
                    handleError(res, ex);
                }
            }
        })
        .put(isAdmin, function (req, res) {
            var id = req.query.id;
            var data = req.body;
            if(!id || !data.content) {
                handleError(res, null, 400, 6);
            }else{
                try{
                    data.content = JSON.parse(data.content);
                    data.last_updated = Date.now();
                    courses.update({_id: req.query.id}, {$set: data}, function (err, wres) {
                        if(err){
                            handleError(res, err);
                        }else{
                            courses.findOne({_id: req.query.id}, function (err, course) {
                                if(err){
                                    handleError(res, err);
                                }else{
                                    handleSuccess(res, course);
                                }
                            });
                        }
                    });
                }catch(ex){
                    handleError(res, ex);
                }
            }
        })
        .delete(isAdmin, function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            if(idToDelete){
                courses.remove({_id: idToDelete}, function (err, wRes) {
                    if(err){
                        handleError(res, err);
                    }else if(wRes == 0){
                        handleError(res, null, 404, 51);
                    }else{
                        handleSuccess(res);
                    }
                });
            }else{
                handleError(res, null, 400, 6);
            }
        });

    app.use('/apiCourses', router);
};