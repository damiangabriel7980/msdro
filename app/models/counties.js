var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var countiesSchema		= new Schema({
    name:        String,
    citiesID:     [{type: String, ref: 'cities'}]
});

module.exports = mongoose.model('counties', countiesSchema);