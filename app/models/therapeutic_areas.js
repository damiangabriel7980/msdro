/**
 * Created by miricaandrei23 on 15.10.2014.
 */
/**
 * Created by miricaandrei23 on 15.10.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var mongoDbIndex = require('../modules/mongooseIndex/index');

var therapeuticAreaSchema		= new Schema({
    has_children: Boolean,
    last_updated: Date,
    name: String,
    enabled:      Boolean,
    "therapeutic-areasID": [{type: String, ref: 'therapeutic-areas', index: true}]
});

module.exports = mongoose.model('therapeutic-areas', therapeuticAreaSchema,'therapeutic-areas');
var Areas = mongoose.model('therapeutic-areas', therapeuticAreaSchema,'therapeutic-areas');
therapeuticAreaSchema.index({name: 1});
mongoDbIndex.mongooseIndex(Areas);