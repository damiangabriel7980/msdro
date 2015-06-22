var request = require('request');
var Q = require('q');

var Config = require('../../../config/environment.js'),
    my_config = new Config();

var subscribe = function (user_id, deviceType, notificationToken) {
    var deferred = Q.defer();
    if(!user_id){
        deferred.reject("Subscribe for push - missing user id");
    }else if(!deviceType || !notificationToken){
        deferred.reject("Subscribe for push - missing deviceType / notificationToken");
    }else{
        //subscribe user for push notifications
        var subscribeData = {
            "user": my_config.pushServerPrefix + user_id,
            "type": deviceType,
            "token": notificationToken
        };

        request({
            url: my_config.pushServerAddress+"/subscribe",
            method: "POST",
            json: true,
            body: subscribeData,
            strictSSL: false
        }, function (error, message, response) {
            if(error){
                deferred.reject(error);
            }else{
                deferred.resolve();
            }
        });
    }
    return deferred.promise;
};

// get user ids
// return array like [PREFIX + idAsString]
var encodeNotificationsIds = function (ids, cb) {
    var ret = [];
    async.each(ids, function (id, callback) {
        ret.push(my_config.pushServerPrefix + id.toString());
        callback();
    }, function (err) {
        cb(ret);
    });
};

//================================================================================================= send push notifications

var sendPushNotification = function (message, arrayUsersIds) {
    var deferred = Q.defer();
    encodeNotificationsIds(arrayUsersIds, function (usersToSendTo) {
        var data = {
            "users": usersToSendTo,
            "android": {
                "collapseKey": "optional",
                "data": {
                    "message": message
                }
            },
            "ios": {
                "badge": 0,
                "alert": message,
                "sound": "soundName"
            }
        };

        request({
            url: my_config.pushServerAddress + "/send",
            method: 'POST',
            json: true,
            body: data,
            strictSSL: false
        }, function (error, message, response) {
            if(error){
                deferred.reject(error);
            }else{
                deferred.resolve(response);
            }
        });
    });
    return deferred.promise;
};

module.exports = {
    subscribe: subscribe,
    sendPushNotification: sendPushNotification
};