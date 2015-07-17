var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var schema		= new Schema({
    name: {type: String, required: true, unique: true},
    isEnabled: Boolean,
    description: String,
    image_path: String,
    last_updated: Date
});

module.exports = mongoose.model('public-categories', schema, 'public-categories');