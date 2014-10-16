/**
 * Created by miricaandrei23 on 15.10.2014.
 */
/**
 * Created by miricaandrei23 on 15.10.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var therapeuticAreaSchema		= new Schema({
    version_ther:     Number,
    has_children: Number,
    last_updated: Date,
    nameT: String,
    id_for_children: Number,
    parent_therapeutic_area: Number,
    enableT:      Number
});

module.exports = mongoose.model('therapeuticAreas', therapeuticAreaSchema);
