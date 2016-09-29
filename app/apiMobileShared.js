var mongoose = require('mongoose');
var User = require('./models/user');
var Roles=require('./models/roles');
var jwt = require('jsonwebtoken');
var validator = require('validator');
var crypto   = require('crypto');
var expressJwt = require('express-jwt');
var async = require('async');
var Q = require('q');

var Job = require('./models/jobs');

var UtilsService = require('./modules/utils');
var TokenService = require('./modules/tokenAuth');

module.exports = function(app, logger, tokenSecret, router) {

    //=============================================Define variables
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);

    //returns user data (parsed from token found on the request)
    var getUserData = function (req) {
        return TokenService.getUserData(req);
    };

    //access control allow origin *
    app.all("/apiMobileShared/*", function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
        next();
    });

    // We are going to protect /apiMobileShared routes with JWT
    app.use('/apiMobileShared', expressJwt({secret: tokenSecret}).unless({path: ['/apiMobileShared/createAccount',
                                                                                 '/apiMobileShared/resetPass',/\/apiMobileShared\/activateAccount\/w*/i]}));

    /**
     * @apiName Redirect_Create_Account
     * @apiDescription Redirect to the global API for creating an account
     * @apiGroup Mobile_API
     * @api {post} /apiMobileShared/createAccount Redirect to the global API for creating an account
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiExample {curl} Example usage:
     *     curl -i -X POST -H "Authorization: Bearer " http://localhost:8080/apiMobileShared/createAccount
     * @apiSuccess {json} response an empty object
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *
     *     }
     */
    router.route('/createAccount')
        .post(function (req, res) {
            res.redirect(307, '/apiGloballyShared/createAccountMobile');
        });

    /**
     * @apiName Reset_Password
     * @apiDescription Redirect to the global API for resetting a password
     * @apiGroup Mobile_API
     * @api {post} /apiMobileShared/resetPass Redirect to the global API for resetting a password
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiExample {curl} Example usage:
     *     curl -i -X POST -H "Authorization: Bearer " http://localhost:8080/apiMobileShared/resetPass
     * @apiSuccess {json} response an empty object
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *
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

    //========================================================================================== ACTIVATE ACCOUNT
    /**
     * @apiName Activate_Account
     * @apiDescription Activate a user's account
     * @apiGroup Mobile_API
     * @api {get} /apiMobileShared/activateAccount/:token Activate a user's account
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {String} token an activation token
     * @apiExample {curl} Example usage:
     *     curl -i -H "Authorization: Bearer " http://localhost:8080/apiMobileShared/activateAccount/iojwdj818281631361hdwwd
     * @apiSuccess {html} response a HTML page
     * @apiSuccessExample {HTML} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *
     *     }
     */
    router.route('/activateAccount/:token')
        .get(function (req, res) {
            User.findOne({ activationToken: req.params.token}, function(err, user) {
                if (!user) {
                    res.render('mobile/accountActivation.ejs', {success: false});
                }else{
                    user.enabled = true;
                    user.activationToken = null;
                    user.save(function (err, user) {
                        if(err){
                            res.render('mobile/accountActivation.ejs', {success: false});
                        }else{
                            res.render('mobile/accountActivation.ejs', {success: true});
                        }
                    });
                }
            });
        });

//========================================================================================================== USER PROFILE
    router.route('/userProfile')
    /**
     * @apiName Get_User_Profile
     * @apiDescription Retrieve a user's profile
     * @apiGroup Mobile_API
     * @api {get} /apiMobileShared/userProfile Retrieve a user's profile
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiExample {curl} Example usage:
     *     curl -i -H "Authorization: Bearer " http://localhost:8080/apiMobileShared/userProfile
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
        .get(function (req, res) {
            handleSuccess(res, getUserData(req));
        })

        /**
         * @apiName Update_User_Data
         * @apiDescription Update a user's data
         * @apiGroup Mobile_API
         * @api {put} /apiMobileShared/userProfile Update a user's data
         * @apiVersion 1.0.0
         * @apiPermission medic
         * @apiUse HeaderAuthorization
         * @apiParam {Array} citiesID an array of ids of cities
         * @apiParam {Array} jobsID an array of ids of jobs
         * @apiParam {String} name the user's name
         * @apiParam {String} phone the user's phone number
         * @apiParam {String} birthday the user's birthday date
         * @apiParam {Array} therapeutic-areasID an array of therapeutic areas ids
         * @apiParam {String} address the user's address
         * @apiParam {Number} practiceType can be 1 = Public, 2 = Private
         * @apiParam {Number} title can be 1 = Dl, 2 = Dna, 3 = Prof, 4 = Dr
         * @apiExample {curl} Example usage:
         *     curl -i -X PUT -H "Authorization: Bearer " -d '{"citiesID" : [], "jobsID" : [], "name" : "",
         *     "phone" : "", "birthday" : "",
         *     "therapeutic-areasID" : [], "address" : "", "practiceType" : 1, "title" : 1
         *     }' http://localhost:8080/apiMobileShared/userProfile
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
        .put(function (req, res) {
            UtilsService.allowFields(req.body, ['citiesID', 'jobsID', 'name', 'phone', 'birthday', 'password', 'therapeutic-areasID', 'address', 'practiceType', 'title']);
            User.update({_id: getUserData(req)._id}, {$set: req.body}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res);
                }
            });
        });

    app.use('/apiMobileShared', router);
};