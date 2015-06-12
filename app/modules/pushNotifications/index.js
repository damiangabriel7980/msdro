var request = require('request');
var Q = require('q');

var Config = require('../../../config/environment.js'),
    my_config = new Config();

exports.subscribe = function (user_id, deviceType, notificationToken) {
    var deferred = Q.defer();
    if(!user_id){
        deferred.reject("Subscribe for push - missing user id");
    }else if(!deviceType || !notificationToken){
        deferred.reject("Subscribe for push - missing deviceType / notificationToken");
    }else{
        //subscribe user for push notifications
        var subscribeData = {
            "user": "MSD"+user_id,
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