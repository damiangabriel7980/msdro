var amazon = require('../../config/amazon')();

var User = require('../models/user');

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
                            deferred.resolve(user);
                            //remove old image if any; careful not to delete the newly uploaded one
                            if(oldImage && oldImage != key) amazon.deleteObject(oldImage);
                        }
                    });
                }
            });
        }
    });
    return deferred.promise;
};

module.exports = {
    updateUserImage: updateUserImage
};