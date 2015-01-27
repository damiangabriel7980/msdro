/**
 * Created by miricaandrei23 on 15.10.2014.
 */
/**
 * Created by miricaandrei23 on 15.10.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var therapeuticAreaSchema		= new Schema({
    has_children: Boolean,
    last_updated: Date,
    name: String,
    enabled:      Boolean,
    "therapeutic-areasID": Array
});

module.exports = mongoose.model('therapeutic-areas', therapeuticAreaSchema,'therapeutic-areas');
