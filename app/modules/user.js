var amazon = require('../../config/amazon')();

var User = require('../models/user');

var Q = require('q');

/**
 * User module.
 * @module userModule
 */

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

module.exports = {
    /**
     * Function that updates the user's profile picture (medic section)
     *
     * @name updateUserImage
     * @function
     * @param {String} user_id - The id of the user to update the image
     * @param {object} imageBody - The image file itself
     * @param {String} imageExtension - The extension of the image file
     * @example
     * var userModule = require(/path/to/user/module)
     * userModule.updateUserImage(200, {}, "png").then(
     *      function(success){
     *
     *      },
     *      function(error){
     *
     *      }
     * );
     *
     */
    updateUserImage: updateUserImage
};