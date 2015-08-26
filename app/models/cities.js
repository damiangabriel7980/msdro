var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var citiesSchema		= new Schema({
    name:        String,
    county: {type: Schema.Types.ObjectId, ref: 'counties'}
});

module.exports = mongoose.model('cities', citiesSchema);