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
    last_modified: Date,
    organizationName: String,
    npiNumber: Number,
    addressLine1: String,
    addressLine2: String,
    nature: String,
    expenseRequestNumber: Number,
    customerExpenseID: Number,
    dataSourceID: String,
    companyID: Number,
    meetingVenueName: String
});

schema.pre('save', isUniqueExpenseID);
schema.pre('save', checkMedicMail);
/**
 * Make sure that the expenseID is unique before editing the user
 * @param {function} next - go to next middleware
 * @param {function} done
 */
function isUniqueExpenseID(next) {
    /* jshint validthis: true */
    var medicCosts = this;
    mongoose.models['medic_costs']
        .findOne({expenseID: medicCosts.expenseID}, function (err, results) {
            if (!!results && results.id != medicCosts.id) {
                return next(new UniqueIDError(true));
            } else {
                return next();
            }
        });
}

function checkMedicMail(next) {
    var medicCosts = this;
    if (medicCosts.isNew) {
        return next();
    }
    mongoose.models['User']
        .findOne({username: medicCosts.userName}, function (err, results) {
            if(!!results) {
                return next();
            } else {
                return next(new emailNotFoundError(true));
            }
        })
}

function emailNotFoundError(emailNotFound) {
    this.emailNotFound = emailNotFound;
}

function UniqueIDError(isUnique) {
    this.isUnique = isUnique;
}
UniqueIDError.prototype = new Error();
emailNotFoundError.prototype = new Error();


module.exports = mongoose.model('medic_costs', schema);