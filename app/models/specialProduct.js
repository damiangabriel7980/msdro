/**
 * Created by miricaandrei23 on 12.02.2015.
 */
var mongoose		= require('mongoose');
var deepPopulate = require('mongoose-deep-populate');
var Schema			= mongoose.Schema;

var specialProductSchema		= new Schema({
    prescription: String,
    safety_information: String,
    logo_path:String,
    header_image: String,
    header_title: String,
    product_name: String,
    general_description:String,
    site_map_description: String,
    job_id: String,
    groups: [{type: Schema.Types.ObjectId,ref: 'UserGroup'}],
    speakers: [{type: Schema.Types.ObjectId,ref: 'speakers'}],
    enabled: Boolean,
    show_safety_info_for: {
        resources: Boolean,
        glossary: Boolean,
        site_map: Boolean
    },
    show_sitemap_prescription: Boolean
});

specialProductSchema.plugin(deepPopulate, {
    whitelist: ['groups.profession']
});

module.exports = mongoose.model('specialProducts', specialProductSchema,'specialProducts');