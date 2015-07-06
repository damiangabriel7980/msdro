var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var countiesSchema		= new Schema({
    name:        {type: String, index: true},
    citiesID:     [{type: String, ref: 'cities', index: true}]
});

module.exports = mongoose.model('counties', countiesSchema);
var county = mongoose.model('counties', countiesSchema);
county.ensureIndexes(function (err) {
    if (err)
        console.log(err);
});
county.on('index', function (err) {
    if (err)
        console.log(err); // error occurred during index creation
});