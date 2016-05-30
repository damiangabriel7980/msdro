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
    enabled: Boolean,
    specialApps: [{type: Schema.Types.ObjectId, ref: 'groupsApplications'}]
});

module.exports = mongoose.model('pathologies', PathologiesSchema, 'pathologies');