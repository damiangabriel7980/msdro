var mongoose = require('mongoose');
var User = require('./models/user');
var Roles=require('./models/roles');
var jwt = require('jsonwebtoken');
var XRegExp  = require('xregexp').XRegExp;
var validator = require('validator');
var crypto   = require('crypto');
var expressJwt = require('express-jwt');
var async = require('async');

var Cities = require('./models/cities');
var Therapeutic_Area = require('./models/therapeutic_areas');
var Counties = require('./models/counties');
var Job = require('./models/jobs');


module.exports = function(app, mandrill, logger, tokenSecret, pushServerAddr, router) {

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
            res.redirect(307, '/apiGloballyShared/createAccount');
        });

    //generate token for resetting user password
    router.route('/resetPass')
        .post(function(req, res) {
            res.redirect(307, '/apiGloballyShared/resetPass');
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

//========================================================================================================== route for retrieving user's profile info
    router.route('/userProfile')
        .get(function (req, res) {
            res.json(getUserData(req));
        });

    app.use('/apiMobileShared', router);
};