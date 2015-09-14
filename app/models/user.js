// load the things we need
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');
var crypto   = require('crypto-js/sha256');
var Schema			= mongoose.Schema;
var mongoDbIndex = require('../modules/mongooseIndex/index');
var UserService = require('../modules/user');

// define the schema for our user model
var userSchema = new Schema({
    account_expired: {type: Boolean, select: false},
    account_locked: {type: Boolean, select: false},
    citiesID: {type: [{type: Schema.Types.ObjectId, ref: 'cities'}], select: false},
    enabled: {type: Boolean, select: false},
    image_path: String,
    jobsID: {type: [{type: Schema.Types.ObjectId, ref: 'Job'}], select: false},
    language: String,
    last_updated: Date,
    name: String,
    showPresentation: Boolean,
    phone: {type: String, select: false},
    points: {type: Number, select: false},
    proof_path: {type: String, select: false},
    rolesID: {type: [{type: Schema.Types.ObjectId, ref: 'Role'}], select: false},
    birthday: {type: Date, select: false},
    show_welcome_screen: Boolean,
    state: {type: String, select: false, index: true},
    description: {type: String, select: false},
    password     : {type: String, select: false},
    username     : {type: String, index: true},
    groupsID     : [{type: Schema.Types.ObjectId, ref: 'UserGroup', index: true}],
    profession: {type: Schema.Types.ObjectId,ref: 'professions'},
    'therapeutic-areasID': [{type: Schema.Types.ObjectId, ref: 'therapeutic-areas'}],
    resetPasswordToken: {type: String, select: false},
    resetPasswordExpires: {type: Date, select: false},
    activationToken: {type: String, select: false},
    conferencesID:[{type: Schema.Types.ObjectId,ref: 'conferences'}],
    topicsID:[{type: Schema.Types.ObjectId,ref: 'topics'}],
    visible: Boolean,
    connectedToDOC: Boolean,
    subscriptions: {
        newsletterStaywell: Boolean,
        infoMSD: Boolean
    },
    address: {type: String, select: false},
    practiceType: {type: Number, select: false}, // 1 = Public , 2 = Private
    title: {type: Number, select: false}, // 1 = Dl, 2 = Dna, 3 = Prof, 4 = Dr
    registeredFrom: String
});
userSchema.plugin(deepPopulate, {
    whitelist: ['profession', 'groupsID.profession']
});

userSchema.pre('save', function (next) {
    //isNew is a predefined property present in mogoose's pre save hook
    //we can assign it to our own wasNew property so that we can verify in the post save hook
    //whether the saved document is newly created or just updated
    this.wasNew = this.isNew;
    next();
});

userSchema.post('save', function (doc) {
    //if the document is newly created do something
    if(this.wasNew){
        UserService.accountJustCreated(this.username);
    }
});


// generating a hash
userSchema.methods.generateHash = function(password) {
    return crypto(password).toString();
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
     return crypto(password).toString()===this.password;
};

userSchema.methods.getEmailTitle = function () {
    switch(this.title){
        case 1: return "D-le";
        case 2: return "D-na";
        case 3: return "Prof.";
        case 4: return "Dr.";
        default: return "";
    }
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);


var usr = mongoose.model('User', userSchema);
mongoDbIndex.mongooseIndex(usr);