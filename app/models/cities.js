var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var citiesSchema		= new Schema({
    name:        String
});

module.exports = mongoose.model('cities', citiesSchema);