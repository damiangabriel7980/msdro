var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    expenseID: {type: Number, unique: true},
    customerID: Number,
    showCost: {type: Boolean, default: true},
    dateOfPayment: Date,
    meetingDate: Date,
    date_created: Date,
    last_modified: Date
});

schema.pre('save', isUnique);
/**
 * Make sure that the expenseID is unique before editing the user
 * @param {function} next - go to next middleware
 * @param {function} done
 */
function isUnique(next) {
    /* jshint validthis: true */
    var medicCosts = this;

    mongoose.models['medic_costs']
        .findOne({ expenseID: medicCosts.expenseID}, function(err, results) {
            if (!!results) {
                return next(new UniqueIDError(true));
            } else {
                return next();
            }
        });
}

function UniqueIDError(isUnique) {
    this.isUnique = isUnique;
}
UniqueIDError.prototype = new Error();


module.exports = mongoose.model('medic_costs', schema);