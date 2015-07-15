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

    router.route('/createAccount')
        .post(function (req, res) {
            res.redirect(307, '/apiGloballyShared/createAccountMobile');
        });

    //generate token for resetting user password
    router.route('/resetPass')
        .post(function(req, res) {
            res.redirect(307, '/apiGloballyShared/requestPasswordReset');
        });

    //========================================================================================== ACTIVATE ACCOUNT
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
        .get(function (req, res) {
            handleSuccess(res, getUserData(req));
        })
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