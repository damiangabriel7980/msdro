var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var schema		= new Schema({
    name: String,
    default_value: String,
    value: String
});

module.exports = mongoose.model('parameters', schema, 'parameters');