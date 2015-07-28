var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var mongoosastic = require('mongoosastic');
var searchIndex = require('../modules/mongoosasticIndex/index');
var mongoDbIndex = require('../modules/mongooseIndex/index');

var Config = require('../../config/environment.js'),
    my_config = new Config();

//type: 1 = stire (noutati)
//      2 = articol (despre)
//      3 = elearning
//      4 = download
var publicContentSchema		= new Schema({
    title:        {type:String, es_indexed:true},
    author:       String,
    description:  {type:String, es_indexed:true},
    text:         {type:String, es_indexed:true},
    type:         {type:Number, index: true},
    date_added:   Date,
    last_updated: Date,
    enable:       Boolean,
    image_path:   String,
    file_path:   String,
    'therapeutic-areasID': [{type: Schema.Types.ObjectId, ref: 'therapeutic-areas'}],
    category: {type: Schema.Types.ObjectId, ref: 'public-categories', index: true}
});
publicContentSchema.plugin(mongoosastic,{host:my_config.elasticServer,port:my_config.elasticPORT});
module.exports = mongoose.model('public-content', publicContentSchema, 'public-content');
var PublicContent = mongoose.model('public-content', publicContentSchema, 'public-content');

publicContentSchema.index({title: 1});
searchIndex.mongoosasticIndex(PublicContent);
mongoDbIndex.mongooseIndex(PublicContent);