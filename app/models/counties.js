var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var mongoDbIndex = require('../modules/mongooseIndex/index');

var countiesSchema		= new Schema({
    name:        {type: String, index: true},
    label: String,
    citiesID:     [{type: Schema.Types.ObjectId, ref: 'cities', index: true}]
});

module.exports = mongoose.model('counties', countiesSchema);
var county = mongoose.model('counties', countiesSchema);
mongoDbIndex.mongooseIndex(county);