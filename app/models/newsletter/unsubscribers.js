var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var schema = new Schema({
    email: String
});

module.exports = mongoose.model('newsletter_unsubscribers', schema);