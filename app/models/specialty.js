var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var SpecialtySchema		= new Schema({
    name: {type: String},
    lastUpdated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('specialty', SpecialtySchema, 'specialty');