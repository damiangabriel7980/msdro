var jwt = require('jsonwebtoken');

var User = require('../../models/user');
var AnswerGivers = require('../../models/qa_answerGivers');

var Q = require('q');
var UserService = require('../user');

var UtilsModule = require('../utils');

var Config = require('../../../config/environment.js'),
    my_config = new Config();

var getTokenReq = function (req) {
    try{
        return req.headers.authorization.split(' ').pop();
    }catch(ex){
        return false;
    }
};

var signToken = function (profile) {
    return jwt.sign(profile, my_config.tokenSecret);
};

var getUserData = function (req) {
    var token = getTokenReq(req);
    return token?jwt.decode(token):{};
};

var formatTokenProfile = function (user) {
    return {
        _id: user._id,
        username: user.username,
        name: user.name,
        image_path: user.image_path,
        answerer: false
    };
};

var authenticateToken = function (username, password) {
    var deferred = Q.defer();
    //find user in database
    User.findOne({ 'username' :  UtilsModule.regexes.emailQuery(username)}).select("+account_expired +account_locked +enabled +password +state").exec(function(err, user) {
        // if there are any errors, return error status
        if (err){
            deferred.reject({status: 403, message: "Forbidden"});
        }else{
            // if no user is found, return the message
            if (!user){
                deferred.reject({status: 401, message: "Wrong username/password"});
            }else{
                //check account not expired, not locked etc
                if(user.account_expired || user.account_locked || !user.enabled){
                    deferred.reject({status: 401, message: "Access not allowed"});
                }else{
                    //check password
                    if (!user.validPassword(password)){
                        deferred.reject({status: 401, message: "Wrong username/password"});
                    }else{
                        user.answerer = false;
                        var profile = formatTokenProfile(user);
                        //check if user is an answerer
                        AnswerGivers.findOne({id_user: user._id}, function (err, data) {
                            if(err){
                                deferred.reject({status: 500, message: err});
                            }else{
                                if(data){
                                    profile.answerer = true;
                                    profile.alias = data;
                                }
                                // We are sending the profile inside the token
                                var token = signToken(profile);
                                deferred.resolve({ token: token , profile: profile});
                            }
                        });
                    }
                }
            }
        }
    });
    return deferred.promise;
};

var refreshToken = function (req) {
    var deferred = Q.defer();
    try{
        var token = getTokenReq(req);
        if(token){
            var user_id = jwt.decode(token)._id;
            User.findOne({_id: user_id}, function (err, user) {
                if(err){
                    deferred.reject("Error at updateTokenData - get user");
                }else if(!user){
                    deferred.reject("Error at updateTokenData - user not found");
                }else{
                    var userProfile = formatTokenProfile(user);
                    token = signToken(userProfile);
                    deferred.resolve(token);
                }
            });
        }else{
            deferred.reject("Error at updateTokenData - token not found");
        }
    }catch(ex){
        deferred.reject("Error at updateTokenData - parse token");
    }
    return deferred.promise;
};

module.exports = {
    authenticateToken: authenticateToken,
    refreshToken: refreshToken,
    getUserData: getUserData
};