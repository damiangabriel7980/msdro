//used to sign cookies based on session secret
var cookieSig = require('express-session/node_modules/cookie-signature');
var User = require('../../models/user');
var Roles = require('../../models/roles');

module.exports = function (logger, sessionSecret) {

    var handleError = require('../responseHandler/error')(logger);

    var isLoggedIn = function(req, res, next) {

        if (req.isAuthenticated()){
            return next();
        }else{
            handleError(res,true,403,13);
        }
    };

    var hasAdminRights = function(req, res, next) {

        try{
            //get encripted session id from cookie
            var esidc = req.cookies['connect.sid'];
            //get node session id from request
            var sid = req.sessionID;
            //encrypt sid using session secret
            var esid = "s:"+cookieSig.sign(sid, sessionSecret);
            //if esid matches esidc then user is authentic
            if(esid === esidc){
                //get session store info for this session
                var ssi = req.sessionStore.sessions[req.sessionID];
                ssi = JSON.parse(ssi);
                //now get user id
                var userID = ssi['passport']['user'];
                //now get user's roles
                User.find({_id: userID}, {rolesID :1}).select("+rolesID").exec(function (err, data) {
                    if(err){
                        logger.error(err);
                        handleError(res, err);
                    }else{
                        var roles = data[0].rolesID;
                        //now get roles
                        Roles.find({_id: {$in: roles}}, function (err, data) {
                            if(err){
                                logger.error(err);
                                handleError(res, err);
                            }else{
                                var admin = false;
                                for(var i=0; i<data.length; i++){
                                    if(data[i].authority === "ROLE_ADMIN") admin=true;
                                }
                                if(admin === true){
                                    next();
                                }else{
                                    handleError(res, true, 403, 14);
                                }
                            }
                        });
                    }
                });
            }else{
                handleError(res,true,403,13);
            }
        }catch(e){
            handleError(res, e);
        }

    };

    return {
        isLoggedIn: isLoggedIn,
        hasAdminRights: hasAdminRights
    };

};