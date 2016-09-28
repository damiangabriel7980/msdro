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
    /**
     * @apiName Get_Courses
     * @apiDescription Retrieve a course / list of courses
     * @apiGroup Courses
     * @api {get} /apiPublic/apiCourses/courses Retrieve a course / list of courses
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiUse HeaderAuthorization
     * @apiParam {String} id The id of a course
     * @apiExample {curl} Example usage (with id):
     *     curl -i -H "Authorization: Bearer " http://localhost:8080/apiPublic/apiCourses/courses?id=23fwafwa1221f
     * @apiExample {curl} Example usage (no id):
     *     curl -i -H "Authorization: Bearer " http://localhost:8080/apiPublic/apiCourses/courses
     * @apiSuccess {Object} response.success         an object containing the course / an array of courses
     * @apiSuccess {String}   response.message       A success message.
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success":
     *       {
     *
     *       },
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiSuccessExample {json} Success-Response (no id):
     *     HTTP/1.1 200 OK
     *     {
     *       "success":[
     *       {
     *
     *       }
     *      ],
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *       "error": "Query Error",
     *       "data" : {}
     *     }
     */
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
        /**
         * @apiName Post_Courses
         * @apiDescription Create a new course
         * @apiGroup Courses
         * @api {post} /apiPublic/apiContractManagement/templates Create a new course
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiUse HeaderAuthorization
         * @apiParam {Object} courseModel An object containing the properties of the course Mongo model
         * @apiExample {curl} Example usage:
         *     curl -i -X POST -H "Authorization: Bearer " -d '{"name":"someName","content":"someContent"}' http://localhost:8080/apiCourses/courses
         * @apiSuccess {Object} response.success         an object containing the newly created course
         * @apiSuccess {String}   response.message       A success message.
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "success":
         *       {
         *
         *       },
         *       "message": "Cererea a fost procesata cu succes"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *       "error": "Query Error",
         *       "data" : {}
         *     }
         * @apiError BadRequest The POST request doesn't contain all necessary data
         * @apiErrorExample {json} Error-Response (4xx):
         *     HTTP/1.1 400 Bad Request
         *     {
         *       "error": "Bad request",
         *       "data" : {}
         *     }
         */
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
        /**
         * @apiName Update_Courses
         * @apiDescription Update an existing course
         * @apiGroup Courses
         * @api {put} /apiPublic/apiContractManagement/templates Update an existing course
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiUse HeaderAuthorization
         * @apiParam {String} course_id The id of the course we want to update
         * @apiParam {Object} courseModel An object containing the properties of the course Mongo model
         * @apiExample {curl} Example usage:
         *     curl -i -X PUT -H "Authorization: Bearer " -d '{"name":"someName","content":"someContent"}' http://localhost:8080/apiCourses/courses?id=23nf88y23nddy
         * @apiSuccess {Object} response.success         an object containing the updated course
         * @apiSuccess {String}   response.message       A success message.
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "success":
         *       {
         *
         *       },
         *       "message": "Cererea a fost procesata cu succes"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *       "error": "Query Error",
         *       "data" : {}
         *     }
         * @apiError BadRequest The PUT request doesn't contain all necessary data
         * @apiErrorExample {json} Error-Response (4xx):
         *     HTTP/1.1 400 Bad Request
         *     {
         *       "error": "Bad request",
         *       "data" : {}
         *     }
         */
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
        /**
         * @apiName Delete_Courses
         * @apiDescription Delete a course
         * @apiGroup Courses
         * @api {delete} /apiPublic/apiCourses/courses Delete a course
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiUse HeaderAuthorization
         * @apiParam {String} id The id of a course
         * @apiExample {curl} Example usage:
         *     curl -i -X DELETE -H "Authorization: Bearer " http://localhost:8080/apiPublic/apiCourses/courses?id=23fwafwa1221f
         * @apiSuccess {Object} response.success         an empty object
         * @apiSuccess {String}   response.message       A success message.
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "success":
         *       {
         *
         *       },
         *       "message": "Cererea a fost procesata cu succes"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *       "error": "Query Error",
         *       "data" : {}
         *     }
         * @apiUse BadRequest
         * @apiErrorExample {json} Error-Response (400):
         *     HTTP/1.1 400 Bad Request Error
         *     {
         *       "error": "Error",
         *       "data" : {}
         *     }
         * @apiUse EntityNotFound
         * @apiErrorExample {json} Error-Response (404):
         *     HTTP/1.1 404 Not found Error
         *     {
         *       "error": "Error",
         *       "data" : {}
         *     }
         */
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