var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var countiesSchema		= new Schema({
    name:        String,
    citiesID:     Array
});

module.exports = mongoose.model('counties', countiesSchema);