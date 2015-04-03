var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var schema		= new Schema({
    name: {type: String, required: true, unique: true},
    enabled: Boolean
});

module.exports = mongoose.model('public-categories', schema, 'public-categories');