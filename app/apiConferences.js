/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose = require('mongoose');
var Events = require('./models/events');
var Conferences = require('./models/conferences');
var Talks = require('./models/talks');
var Speakers = require('./models/speakers');
var User = require('./models/user');
var Roles=require('./models/roles');
var jwt = require('jsonwebtoken');
var validator = require('validator');
var crypto   = require('crypto');
var expressJwt = require('express-jwt');
var async = require('async');
var request = require('request');

var PushService = require('./modules/pushNotifications');
var ConferencesModule=require('./modules/Conferences');

module.exports = function(app, my_config, logger, tokenSecret, router) {

    //=============================================Define variables
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);
    if(my_config.events.overwriteApiResponses){
        handleSuccess = function(res, object){
            res.send(object);
        }
        handleError = function(res, err){
            res.send(err);
        }
    }

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



    //================================================================================================= access control and route protection
    //access control allow origin *
    app.all("/apiConferences/*", function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
        next();
    });

    // We are going to protect /apiConferences routes with JWT
    app.use('/apiConferences', expressJwt({secret: tokenSecret}).unless({path: ['/apiConferences/createAccount', '/apiConferences/resetPass']}));

    /**
     * @apiName Redirect_Create_Account
     * @apiDescription Redirect to the global API for creating an account
     * @apiGroup Check-In_Conferences_API
     * @api {post} /apiConferences/createAccount Redirect to the global API for creating an account
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {Object} user a user object containing the following properties:
     *   title, name, email, password, registeredFrom, job
     * @apiExample {curl} Example usage:
     *     curl -i -X POST -H "Authorization: Bearer " -d '{user: {}}' http://localhost:8080/apiConferences/createAccount
     * @apiSuccess {json} response an object containing the current state of the user and the username
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *              user: '',
     *              state: ''
     *        },
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *
     *     }
     */
    //===================================================================================================================== create account
    router.route('/createAccount')
        .post(function (req, res) {
            res.redirect(307, '/apiGloballyShared/createAccountMobile');
        });

    /**
     * @apiName Reset_Password
     * @apiDescription Redirect to the global API for resetting a password
     * @apiGroup Check-In_Conferences_API
     * @api {post} /apiConferences/resetPass Redirect to the global API for resetting a password
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {String} email the user's email
     * @apiExample {curl} Example usage:
     *     curl -i -X POST -H "Authorization: Bearer " -d '{email : ''}' http://localhost:8080/apiConferences/resetPass
     * @apiSuccess {json} response an object containing the email the reset password email was sent to
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *          mailto: ''
     *        },
     *        message : "A message"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *
     *     }
     */
    //generate token for resetting user password
    router.route('/resetPass')
        .post(function(req, res) {
            res.redirect(307, '/apiGloballyShared/requestPasswordReset');
        });

    /**
     * @apiName Get_User_Profile
     * @apiDescription Retrieve a user's profile
     * @apiGroup Check-In_Conferences_API
     * @api {get} /apiConferences/userProfile Retrieve a user's profile
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiExample {curl} Example usage:
     *     curl -i -H "Authorization: Bearer " http://localhost:8080/apiConferences/userProfile
     * @apiSuccess {json} response.success an object containing user data
     * @apiSuccess {json} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          success : {
     *
     *          },
     *          message: "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *
     *     }
     */
    //route for retrieving user's profile info
    router.route('/userProfile')
        .get(function (req, res) {
            handleSuccess(res, getUserData(req));
        });

    //=========================================================================================== unsubscribe from push notifications
    /**
     * @apiName Unsubscribe_Push_Notifications
     * @apiDescription Un-subscribe from push notifications
     * @apiGroup Check-In_Conferences_API
     * @api {post} /apiConferences/unsubscribeFromPush Un-subscribe from push notifications
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {String} token a unique token to identify device to un-subscribe the user from push notifications
     * @apiExample {curl} Example usage:
     *     curl -i -X POST -H "Authorization: Bearer " http://localhost:8080/apiConferences/unsubscribeFromPush
     * @apiSuccess {json} response.success an empty object
     * @apiSuccess {json} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          success : {
     *
     *          },
     *          message: "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "Error Message",
     *          data: {}
     *     }
     */
    router.route('/unsubscribeFromPush')
        .post(function (req, res) {
            var token = req.body.token;
            PushService.unsubscribe(token).then(
                function () {
                    handleSuccess(res, true, 15);
                },
                function () {
                    handleError(res, true, 500, 30);
                }
            );
        });

    //==================================================================================================================== all routes
    /**
     * @apiName Get_All_Details_For_Conferences
     * @apiDescription Retrieve all conferences and all their details (rooms, speakers)
     * @apiGroup Check-In_Conferences_API
     * @api {get} /apiConferences/getConferencesFull Retrieve all conferences and all their details (rooms, speakers)
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiExample {curl} Example usage:
     *     curl -i -H "Authorization: Bearer " http://localhost:8080/apiConferences/getConferencesFull
     * @apiSuccess {json} response.success an array containing all conferences and all their details (rooms, speakers)
     * @apiSuccess {json} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          success : [
     *
     *          ],
     *          message: "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "Error Message",
     *          data: {}
     *     }
     */
    router.route('/getConferencesFull')
        .get(function (req, res) {
            var user = getUserData(req);
            if(user._id){
                ConferencesModule.getConferencesForUser(user._id, function (err, resp) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, resp);
                    }
                });
            }else{
                handleSuccess(res, []);
            }
        });

    /**
     * @apiName Retrieve_Conference_And_AddIt_To_User
     * @apiDescription Retrieve a conference and add it to a user
     * @apiGroup Check-In_Conferences_API
     * @api {post} /apiConferences/scanConference  Retrieve a conference and add it to a user
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {String} id the id of the conference
     * @apiExample {curl} Example usage:
     *     curl -i -X POST -H "Authorization: Bearer " http://localhost:8080/apiConferences/scanConference
     * @apiSuccess {json} response.success an object containing the scanned conference
     * @apiSuccess {json} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          success : {
     *
     *          },
     *          message: "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "Error Message",
     *          data: {}
     *     }
     * @apiUse EntityNotFound
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 404 NotFound Error
     *     {
     *          error: "Error Message",
     *          data: {}
     *     }
     */
    router.route('/scanConference')
        .post(function (req, res) {
            var idConf = mongoose.Types.ObjectId(req.body.id.toString());
            var thisUser = getUserData(req);
            //check if conference exists
            Conferences.findOne({_id: idConf}, function (err, conference) {
                if(err){
                    handleError(res, err);
                }else{
                    if(conference){
                        //add conference id to user
                        ConferencesModule.addConferenceToUser(idConf, thisUser._id, function (err, resp) {
                            if(err){
                                handleError(res, err);
                            }else{
                                //return scanned conference
                                ConferencesModule.getConference(idConf, function (err, conference) {
                                    if(err){
                                        handleError(res, err);
                                    }else{
                                        handleSuccess(res, conference);
                                    }
                                });
                            }
                        })
                    }else{
                        handleError(res, true, 404, 1);
                    }
                }
            });
        });

    /**
     * @apiName Retrieve_Room_And_Add_Associated_Conference_To_User
     * @apiDescription Retrieve a conference and add it to a user using a room id
     * @apiGroup Check-In_Conferences_API
     * @api {post} /apiConferences/scanRoom  Retrieve a conference and add it to a user
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {String} id the id of the room
     * @apiExample {curl} Example usage:
     *     curl -i -X POST -H "Authorization: Bearer " http://localhost:8080/apiConferences/scanRoom
     * @apiSuccess {json} response.success an object containing the scanned conference
     * @apiSuccess {json} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          success : {
     *
     *          },
     *          message: "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "Error Message",
     *          data: {}
     *     }
     * @apiUse EntityNotFound
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 404 NotFound Error
     *     {
     *          error: "Error Message",
     *          data: {}
     *     }
     */
    router.route('/scanRoom')
        .post(function (req, res) {
            var idRoom = mongoose.Types.ObjectId(req.body.id.toString());
            //get id of conference
            Talks.findOne({room: idRoom}, function (err, talk) {
                if(err){
                    handleError(res, err);
                }else{
                    if(talk){
                        var idConf = talk.conference;
                        var thisUser = getUserData(req);
                        ConferencesModule.addConferenceToUser(idConf, thisUser._id, function (err, resp) {
                            if(err){
                                handleError(res, err);
                            }else{
                                //return scanned conference
                                ConferencesModule.getConference(idConf, function (err, conference) {
                                    if(err){
                                        handleError(res, err);
                                    }else{
                                        handleSuccess(res, conference);
                                    }
                                });
                            }
                        });
                    }else{
                        handleError(res, true, 404, 1);
                    }
                }
            });
        });

    app.use('/apiConferences', router);
};