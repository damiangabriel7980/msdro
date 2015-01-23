// load the things we need
var mongoose = require('mongoose');
var crypto   = require('crypto-js/sha256');
var Schema			= mongoose.Schema;
// define the schema for our user model
var userSchema = new Schema({
    account_expired: Boolean,
    account_locked: Boolean,
    citiesID: Array,
    enabled: Boolean,
    image_path: String,
    jobsID: Array,
    language: String,
    last_updated: Date,
    name: String,
    phone: String,
    points: Number,
    proof_path: String,
    rolesID: Array,
    birthday: Date,
    show_welcome_screen: Boolean,
    state: String,
    description:String,
    subscription: Number,
    password     : String,
    username     : String,
    groupsID     : Array,
    'therapeutic-areasID': Array,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    activationToken: String,
    conferencesID:[{type: Schema.Types.ObjectId,ref: 'conferences'}],
    topicsID:[{type: Schema.Types.ObjectId,ref: 'topics'}],
    visible: Boolean
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
