var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

var ModelInfos = require('../../modules/modelInfos');

var schema		= new Schema({
    "type": {type: String, enum: ["manager", "reprezentant", "medic"]},
    name: String,
    city: {type: Schema.Types.ObjectId, ref: 'cities'},
    phone: String,
    users_associated: [{type: Schema.Types.ObjectId, ref: 'januvia_users'}],
    date_created: Date,
    last_modified: Date
});

schema.plugin(deepPopulate, {
    whitelist: ['city.county']
});

schema.pre('save', function (next) {
    this.last_modified = Date.now();
    ModelInfos.recordLastUpdate("januvia_users").then(function () {
        next();
    });
});

schema.pre('remove', function (next) {
    ModelInfos.recordLastUpdate("januvia_users").then(function () {
        next();
    });
});

module.exports = mongoose.model('januvia_users', schema);