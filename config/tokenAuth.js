var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var request = require('request');

var User = require('../app/models/user');
var UserGroup = require('../app/models/userGroup');
var AnswerGivers = require('../app/models/qa_answerGivers');

module.exports = function (app, logger, tokenSecret, pushServerAddr) {

    app.options('/authenticateToken', function (req, res) {
        var headers = {};
        // IE8 does not allow domains to be specified, just the *
        // headers["Access-Control-Allow-Origin"] = req.headers.origin;
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
    });

    app.post('/authenticateToken', function (req, res) {
        logger.warn("token auth - username: ", req.body.username);

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");

        var deviceType = req.body.deviceType;
        var notificationToken = req.body.notificationToken;

        //find user in database
        User.findOne({ 'username' :  {$regex: "^"+req.body.username.replace(/\+/g,"\\+")+"$", $options: "i"}}).select("+account_expired +account_locked +enabled +password +state").exec(function(err, user) {
            // if there are any errors, return error status
            if (err){
                res.status(403).end();
            }else{
                // if no user is found, return the message
                if (!user){
                    res.send(401, 'Wrong username/password');
                }else{
                    //check account not expired, not locked etc
                    if(user.account_expired || user.account_locked || !user.enabled || user.state === "REJECTED"){
                        res.send(401, 'Access not allowed');
                    }else{
                        //check password
                        if (!user.validPassword(req.body.password)){
                            res.send(401, 'Wrong username/password');
                        }else{
                            var profile = {
                                _id: user._id,
                                username: user.username,
                                name: user.name,
                                image_path: user.image_path,
                                answerer: false
                            };
                            //check if user is an answerer
                            AnswerGivers.findOne({id_user: user._id}, function (err, data) {
                                if(err){
                                    logger.error(err);
                                    res.send(err);
                                }else{
                                    if(data){
                                        profile.answerer = true;
                                        profile.alias = data;
                                    }
                                    // We are sending the profile inside the token
                                    var token = jwt.sign(profile, tokenSecret);
                                    
                                    // if user logs in from a device, subscribe user for push notifications
                                    console.log("----------- check subscribe req");
                                    console.log("device: "+deviceType);
                                    console.log("token: "+notificationToken);
                                    if(deviceType && notificationToken){
                                        //subscribe user for push notifications
                                        var subscribeData = {
                                            "user": "MSD"+user._id.toString(),
                                            "type": deviceType,
                                            "token": notificationToken
                                        };

                                        request({
                                            url: pushServerAddr+"/subscribe",
                                            method: "POST",
                                            json: true,
                                            body: subscribeData,
                                            strictSSL: false
                                        }, function (error, message, response) {
                                            if(error){
                                                console.log("---- !!! push server subscribe error");
                                                console.log(error);
                                                logger.error(error);
                                            }
                                        });
                                    }
                                    
                                    res.json({ token: token , profile: profile});
                                }
                            });
                        }
                    }
                }
            }
        });
    });
};
