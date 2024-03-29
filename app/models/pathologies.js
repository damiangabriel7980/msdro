/**
 * Created by andreimirica on 26.04.2016.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var PathologiesSchema		= new Schema({
    display_name: String,
    description:  String,
    header_image: String,
    video_intro: String,
    associated_multimedia: Array,
    last_updated: Date,
    enabled: Boolean,
    order_index: Number,
    specialApps: [{type: Schema.Types.ObjectId, ref: 'groupsApplications'}],
    short_description: String,
    activationCode: String
});

module.exports = mongoose.model('pathologies', PathologiesSchema, 'pathologies');