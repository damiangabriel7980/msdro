var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var schema		= new Schema({
    name: String,
    content: Object,
    last_updated: Date
});

module.exports = mongoose.model('courses', schema, 'courses');