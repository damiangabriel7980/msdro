var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');
var ModelInfos = require('../../modules/modelInfos');

var schema = new Schema({
    name: String,
    associatedMedic: {type: String, index: true},
    date_created: Date,
    last_modified: Date,
    cost: {type: Number}
});


schema.pre('save', function (next) {
    this.last_modified = Date.now();
    ModelInfos.recordLastUpdate("costs_model").then(function () {
        next();
    });
});

schema.pre('remove', function (next) {
    ModelInfos.recordLastUpdate("costs_model").then(function () {
        next();
    });
});

module.exports = mongoose.model('costs_model', schema);