/**
 * Created by andreimirica on 26.04.2016.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var PathologiesSchema		= new Schema({
    display_name: String,
    description:  String,
    header_image: String,
    associated_multimedia: Array,
    last_updated: Date,
    enabled: Boolean
});

module.exports = mongoose.model('pathologies', PathologiesSchema, 'pathologies');