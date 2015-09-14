var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var schema		= new Schema({
	model_name: String,
    last_update: Date
});

module.exports = mongoose.model('modelInfos', schema);