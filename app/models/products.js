/**
 * Created by miricaandrei23 on 15.10.2014.
 */
var mongoose		= require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema			= mongoose.Schema;
var searchIndex = require('../modules/mongoosasticIndex/index');
var mongoDbIndex = require('../modules/mongooseIndex/index');

var Config = require('../../config/environment.js'),
    my_config = new Config();

var ProductSchema		= new Schema({
    description: {type:String,es_indexed:true},
    enable:      Boolean,
    file_path:   String,
    image_path:  String,
    last_updated: Date,
    name: {type:String,es_indexed:true, index: true},
    groupsID: [{type: Schema.Types.ObjectId, ref: 'UserGroup', index: true}],
    'therapeutic-areasID': [{type: Schema.Types.ObjectId, ref: 'therapeutic-areas', index: true}],
    imageUrls:[String],
    videoUrls:[String]
});
ProductSchema.plugin(mongoosastic,{host:my_config.elasticServer,port:my_config.elasticPORT});
module.exports = mongoose.model('products', ProductSchema);
var Product = mongoose.model('products', ProductSchema);
ProductSchema.index({name: 1});
searchIndex.mongoosasticIndex(Product);
mongoDbIndex.mongooseIndex(Product);
