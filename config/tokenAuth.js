var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var User = require('../app/models/user');

module.exports = function (app, tokenSecret) {

    // We are going to protect /apiConferences routes with JWT
    app.use('/apiConferences', expressJwt({secret: tokenSecret}));

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
        console.log("tokenAuth ============================");
        console.log("username: ", req.body.username);
        console.log("password: ", req.body.password);

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
                    if(user.account_expired || user.account_locked || !user.enabled || user.state !== "ACCEPTED"){
                        res.send(401, 'Access not allowed');
                    }else{
                        //check password
                        if (!user.validPassword(req.body.password)){
                            res.send(401, 'Wrong password');
                        }else{
                            var profile = {
                                username: user.username,
                                name: user.name,
                                image_path: user.image_path,
                                phone: user.phone
                            };
                            // We are sending the profile inside the token
                            var token = jwt.sign(profile, tokenSecret);
                            res.json({ token: token });
                        }
                    }
                }
            }
        });
    });
};
