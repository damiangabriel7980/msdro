var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var User = require('../app/models/user');
var UserGroup = require('../app/models/userGroup');

module.exports = function (app, logger, tokenSecret) {

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
        logger.info("token auth - username: ", req.body.username);

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");

        //find user in database
        User.findOne({ 'username' :  { $regex: new RegExp("^" + req.body.username, "i") }}, function(err, user) {
            // if there are any errors, return error status
            if (err){
                res.status(403).end();
            }else{
                // if no user is found, return the message
                if (!user){
                    res.send(401, 'Wrong username');
                }else{
                    //check account not expired, not locked etc
                    if(user.account_expired || user.account_locked || !user.enabled){
                        res.send(401, 'Access not allowed');
                    }else{
                        //check password
                        if (!user.validPassword(req.body.password)){
                            res.send(401, 'Wrong password');
                        }else{
                            var profile = {
                                _id: user._id,
                                username: user.username,
                                name: user.name,
                                image_path: user.image_path,
                                phone: user.phone,
                                answerer: false
                            };
                            //check if user is an answerer ( <=> is in group "Raspunzatori")
                            UserGroup.find({_id: {$in: user.groupsID}, display_name: "Raspunzatori"}, function (err, group) {
                                if(err){
                                    logger.error(err);
                                    res.send(err);
                                }else{
                                    //if the group is found, then user is an answerer
                                    if(group.length != 0){
                                        profile.answerer = true;
                                    }
                                    // We are sending the profile inside the token
                                    var token = jwt.sign(profile, tokenSecret);
                                    res.json({ token: token });
                                }
                            });
                        }
                    }
                }
            }
        });
    });
};
