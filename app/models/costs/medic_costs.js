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
    showCost: {type: Boolean, default: true},
    dateOfPayment: Date,
    meetingDate: Date,
    date_created: Date,
    last_modified: Date
});

module.exports = mongoose.model('medic_costs', schema);