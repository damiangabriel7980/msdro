var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var schema = new Schema({
    name: String,
    date_created: Date,
    send_date: Date,
    subject: String,
    distribution_lists: [{type: Schema.Types.ObjectId, ref: "newsletter_distribution_lists"}],
    templates: [{
        id: {type: Schema.Types.ObjectId, ref: 'newsletter_templates'},
        variables: [{
            "type": {type: String, enum: ["text", "html", "system"]},
            name: String,
            value: String
        }],
        order: Number
    }],
    status: {type: String, enum: ["sent", "not sent", "error"]},
    deleted: {type: Boolean, default: false},
    statistics: {
        recorded: {type: Boolean, default: false},
        sent: Number,
        hard_bounces: Number,
        soft_bounces: Number,
        rejects: Number,
        complaints: Number,
        unsubs: Number,
        opens: Number,
        unique_opens: Number,
        clicks: Number,
        unique_clicks: Number
    }
});

module.exports = mongoose.model('newsletter_campaigns', schema);