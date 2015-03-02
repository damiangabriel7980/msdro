var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var schema = new Schema({
    name: String,
    last_modified: Date,
    isEnabled: Boolean
});

module.exports = mongoose.model('CM_templates', schema, 'CM_templates');