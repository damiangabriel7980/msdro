var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var schema = new Schema({
    name: String,
    date_created: Date,
    send_date: Date,
    distribution_lists: [{type: Schema.Types.ObjectId, ref: "newsletter_distribution_lists"}],
    templates: [{
        id: {type: Schema.Types.ObjectId, ref: 'newsletter_templates'},
        variables: [{
            name: String,
            value: String
        }],
        order: Number
    }]
});

module.exports = mongoose.model('newsletter_campaigns', schema);