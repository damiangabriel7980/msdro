var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var schema = new Schema({
    name: String,
    date_created: Date,
    type: {type: String, enum: ["header", "content", "footer"]},
    html: String,
    variables: [
        {
            "type": {type: String, enum: ["text", "html", "list", "system"]},
            name: String
        }
    ]
});

module.exports = mongoose.model('newsletter_templates', schema);