var User = require('../app/models/user');
var UserGroup = require('../app/models/userGroup');

var TokenService = require('../app/modules/tokenAuth');
var PushService = require('../app/modules/pushNotifications');

module.exports = function (app, logger) {

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
    
    app.get('/authenticateToken', function (req, res) {
        logger.warn("token refresh");
        TokenService.refreshToken(req).then(
            function (token) {
                res.send({token: token});
            },
            function (err) {
                logger.error(err);
                res.send(500, "Server error");
            }
        );
    });

    app.post('/authenticateToken', function (req, res) {
        logger.warn("token auth - username: ", req.body.username);

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");

        var username = req.body.username;
        var password = req.body.password;
        var deviceType = req.body.deviceType;
        var notificationToken = req.body.notificationToken;

        TokenService.authenticateToken(username, password).then(
            function (success) {
                res.send(success);
                //subscribe for notifications
                PushService.subscribe(success.profile._id, deviceType, notificationToken).then(
                    function () {
                        logger.warn("Subscribed for push notifications");
                    },
                    function (err) {
                        logger.error(err);
                    }
                );
            },
            function (error) {
                var status = error.status;
                var msg = error.message;
                logger.error(msg);
                if(error.status === 500){
                    msg = "Server error";
                }
                res.send(status, msg);
            }
        );

    });
};
