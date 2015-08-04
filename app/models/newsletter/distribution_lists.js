var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var schema = new Schema({
    name: String,
    date_created: Date,
    user_groups: [{type: Schema.Types.ObjectId, ref: 'UserGroup'}],
    emails: [{type: String}]
});

module.exports = mongoose.model('newsletter_distribution_lists', schema);