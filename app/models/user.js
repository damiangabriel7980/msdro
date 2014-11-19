// load the things we need
var mongoose = require('mongoose');
var crypto   = require('crypto-js/sha256');
// define the schema for our user model
var userSchema = mongoose.Schema({
    password     : String,
    username     : String,
    groupsID     : Array,
    points: Number,
    points_slide: Number,
    points_video: Number
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return crypto(password).toString();
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
     return crypto(password).toString()===this.password;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
