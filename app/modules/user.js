var amazon = require('../../config/amazon')();

var User = require('../models/user');
var NewsletterUnsubscribers = require('../models/newsletter/unsubscribers');
var UtilsModule = require('./utils');

var Q = require('q');

var updateUserImage = function (user_id, imageBody, imageExtension) {
    var deferred = Q.defer();
    var oldImage;
    User.findOne({_id: user_id}, function (err, user) {
        if(err){
            deferred.reject(err);
        }else if(!user){
            deferred.reject("No user");
        }else{
            if(user.image_path) oldImage = user.image_path;
            var key = "user/"+user._id+"/profile_pic."+imageExtension;
            amazon.addObjectS3(key, imageBody, function (err, success) {
                if(err){
                    deferred.reject(err);
                }else{
                    //update profile
                    user.image_path = key;
                    user.save(function (err, user) {
                        if(err){
                            deferred.reject(err);
                        }else{
                            deferred.resolve(user.image_path);
                            //remove old image if any; careful not to delete the newly uploaded one
                            if(oldImage && oldImage != key) amazon.deleteObjectS3(oldImage);
                        }
                    });
                }
            });
        }
    });
    return deferred.promise;
};

var accountJustCreated = function(email){
    if(typeof email === "string"){
        NewsletterUnsubscribers.remove({email: UtilsModule.regexes.emailQuery(email)}, function(err){
            if(typeof callback === "function") callback(err);
        });
    }
}

module.exports = {
    updateUserImage: updateUserImage,
    accountJustCreated: accountJustCreated
};