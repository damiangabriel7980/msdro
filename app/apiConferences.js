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

module.exports = function(app, logger, tokenSecret, router) {

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

    //===================================================================================================================== create account
    router.route('/createAccount')
        .post(function (req, res) {
            res.redirect(307, '/apiGloballyShared/createAccountMobile');
        });

    //generate token for resetting user password
    router.route('/resetPass')
        .post(function(req, res) {
            res.redirect(307, '/apiGloballyShared/requestPasswordReset');
        });

    //route for retrieving user's profile info
    router.route('/userProfile')
        .get(function (req, res) {
            handleSuccess(res, getUserData(req));
        });

    //=========================================================================================== unsubscribe from push notifications

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

    router.route('/getConferencesFull')
        .get(function (req, res) {
            var user = getUserData(req);
            if(user._id){
                ConferenceModule.getConferencesForUser(user._id, function (err, resp) {
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