// load the things we need
var mongoose = require('mongoose');
var crypto   = require('crypto-js/sha256');
var Schema			= mongoose.Schema;
// define the schema for our user model
var userSchema = new Schema({
    account_expired: {type: Boolean, select: false},
    account_locked: {type: Boolean, select: false},
    citiesID: {type: Array, select: false},
    enabled: {type: Boolean, select: false},
    image_path: String,
    jobsID: {type: Array, select: false},
    language: String,
    last_updated: Date,
    name: String,
    showPresentation: Boolean,
    phone: {type: String, select: false},
    points: {type: Number, select: false},
    proof_path: {type: String, select: false},
    rolesID: {type: [{type: String, ref: 'Role'}], select: false},
    birthday: {type: Date, select: false},
    show_welcome_screen: Boolean,
    state: {type: String, select: false},
    description: {type: String, select: false},
    subscription: Number,
    password     : {type: String, select: false},
    username     : String,
    groupsID     : [{type: String, ref: 'UserGroup'}],
    profession: {type: Schema.Types.ObjectId,ref: 'professions'},
    'therapeutic-areasID': Array,
    resetPasswordToken: {type: String, select: false},
    resetPasswordExpires: {type: Date, select: false},
    activationToken: {type: String, select: false},
    conferencesID:[{type: Schema.Types.ObjectId,ref: 'conferences'}],
    topicsID:[{type: Schema.Types.ObjectId,ref: 'topics'}],
    visible: Boolean,
    connectedToDOC: Boolean
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
