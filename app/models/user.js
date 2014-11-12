// load the things we need
var mongoose = require('mongoose');
var crypto   = require('crypto-js/sha256');
// define the schema for our user model
var userSchema = mongoose.Schema({
    account_expired: Boolean,
    account_locked: Boolean,
    citiesID: Array,
    enabled: Boolean,
    groupsID: Array,
    image_path: String,
    jobsID: Array,
    language: String,
    last_updated: Date,
    name: String,
    phone: String,
    points: Number,
    proof_path: String,
    rolesID: Array,
    show_welcome_screen: Boolean,
    state: String,
    subscription: Number,
    username: String,
    password     : String,
    password_expired: Boolean,
    "therapeutic-areasID": Array
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
