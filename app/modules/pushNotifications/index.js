var request = require('request');
var Q = require('q');

var Config = require('../../../config/environment.js'),
    my_config = new Config();
/**
 * Push Notifications module.
 * @module pushNotifications
 */
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

var unsubscribe = function (token) {
    var deferred = Q.defer();
    if(token){
        var unsubscribeData = {
            "token": token
        };
        request({
            url: my_config.pushServerAddress + "/unsubscribe",
            method: "POST",
            json: true,
            body: unsubscribeData,
            strictSSL: false
        }, function (error, message, response) {
            if(error){
                deferred.reject("Error unsubscibing from push notifications");
            }else{
                deferred.resolve("Successfully unsubscribed from push notifications");
            }
        });
    }else{
        deferred.reject("No token");
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
    /**
     * Function that subscribes a user to the push notifications server
     *
     * @function
     * @name subscribe
     * @param {String} user_id - The mongoDB id of the user
     * @param {String} deviceType - The type of device (android,ios)
     * @param {String} notificationToken - A token for unique identification of the device
     * @example
     * var pushNotif = require(/path/to/pushNotifications/module)
     * pushNotif.subscribe("wdnuiw1812nd", 'android', "mdw812n1nujcnu").then(
     *      function(success){
     *
     *      },
     *      function(error){
     *
     *      }
     * );
     */
    subscribe: subscribe,

    /**
     * Function that un-subscribes a user from the push notifications server
     *
     * @function
     * @name unsubscribe
     * @param {String} notificationToken - The token for unique identification of the device used to identify the device to un-subscribe
     * @example
     * var pushNotif = require(/path/to/pushNotifications/module)
     * pushNotif.unsubscribe("mdw812n1nujcnu").then(
     *      function(success){
     *
     *      },
     *      function(error){
     *
     *      }
     * );
     */
    unsubscribe: unsubscribe,

    /**
     * Function that sends push notifications to certain users
     *
     * @function
     * @name sendPushNotification
     * @param {String} message - Push notification message
     * @param {Array} arrayUsersIds - A set of user ids to send notifications
     * @example
     * var pushNotif = require(/path/to/pushNotifications/module)
     * pushNotif.sendPushNotification("test message", ["mdw812n1nujcnu"]).then(
     *      function(success){
     *
     *      },
     *      function(error){
     *
     *      }
     * );
     */
    sendPushNotification: sendPushNotification
};