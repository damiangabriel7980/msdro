var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');
var ModelInfos = require('../../modules/modelInfos');

var schema = new Schema({
    userName: String,
    name: String,
    city: String,
    country: String,
    amount: {type: Number},
    currency: String,
    purpose: String,
    dbId: String,
    meetingID: Number,
    meetingVenue: String,
    meetingVenueCity: String,
    expenseID: Number,
    customerID: Number,
    dateOfPayment: Date,
    meetingDate: Date,
    date_created: Date,
    last_modified: Date
});


//schema.pre('save', function (next) {
//    this.last_modified = Date.now();
//    ModelInfos.recordLastUpdate("medic_costs").then(function () {
//        next();
//    });
//});
//
//schema.pre('remove', function (next) {
//    ModelInfos.recordLastUpdate("medic_costs").then(function () {
//        next();
//    });
//});

module.exports = mongoose.model('medic_costs', schema);