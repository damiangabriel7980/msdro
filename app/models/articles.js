var mongoose		= require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema			= mongoose.Schema;
var searchIndex = require('../modules/mongoosasticIndex/index');
var mongoDbIndex = require('../modules/mongooseIndex/index');

var Config = require('../../config/environment.js'),
    my_config = new Config();

//type: 1 = national
//      2 = international
//      3 = scientific
var articlesSchema		= new Schema({
    title:        {type:String, es_indexed:true},
    author:       String,
    description:  String,
    text:         {type:String, es_indexed:true},
    type:         {type:Number, index: true},
    created: Date,
    last_updated: Date,
    version:      Number,
    enable:       Boolean,
    image_path:   String,
    nrOfViews: Number,
    groupsID:     {type: [{type: Schema.Types.ObjectId, ref: 'UserGroup'}], index: true},
    associated_images: Array,
    pathologiesID: [{type: Schema.Types.ObjectId, ref: 'pathologies',index: true}],
    short_description: String
});
articlesSchema.plugin(mongoosastic,{host:my_config.elasticServer, port:my_config.elasticPORT});

module.exports = mongoose.model('articles', articlesSchema);
var Article = mongoose.model('articles', articlesSchema);
articlesSchema.index({title: 1});
searchIndex.mongoosasticIndex(Article);
mongoDbIndex.mongooseIndex(Article);