/**
 * Created by miricaandrei23 on 12.02.2015.
 */
var mongoose		= require('mongoose');
var mongoosastic = require('mongoosastic');
var deepPopulate = require('mongoose-deep-populate');
var Schema			= mongoose.Schema;
var mongoDbIndex = require('../modules/mongooseIndex/index');
var searchIndex = require('../modules/mongoosasticIndex/index');

var Config = require('../../config/environment.js'),
    my_config = new Config();

var specialProductSchema		= new Schema({
    prescription: String,
    safety_information: String,
    logo_path:String,
    header_image: String,
    header_title: {type:String, es_indexed:true},
    product_name: {type:String, es_indexed:true},
    general_description:{type:String, es_indexed:true},
    site_map_description: String,
    job_id: String,
    groups: [{type: Schema.Types.ObjectId,ref: 'UserGroup', index: true}],
    speakers: [{type: Schema.Types.ObjectId,ref: 'speakers'}],
    pathologiesID: [{type: Schema.Types.ObjectId, ref: 'pathologies',index: true}],
    enabled: Boolean,
    file_path: String,
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

specialProductSchema.plugin(mongoosastic,{host:my_config.elasticServer, port:my_config.elasticPORT});

module.exports = mongoose.model('specialProducts', specialProductSchema,'specialProducts');
var specialProduct = mongoose.model('specialProducts', specialProductSchema,'specialProducts');
searchIndex.mongoosasticIndex(specialProduct);
mongoDbIndex.mongooseIndex(specialProduct);