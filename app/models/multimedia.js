/**
 * Created by miricaandrei23 on 12.11.2014.
 */
var mongoose		= require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema			= mongoose.Schema;
var searchIndex = require('../modules/mongoosasticIndex/index');
var mongoDbIndex = require('../modules/mongooseIndex/index');

var Config = require('../../config/environment.js'),
    my_config = new Config();

//type: 1 = video, 2 = slide

var multimediaSchema		= new Schema({
    author : String,
    description : {type:String,es_indexed:true},
    enable : Boolean,
    file_path : String,
    last_updated : Date,
    points : Number,
    run_time: Number,
    groupsID: [{type: Schema.Types.ObjectId, ref: 'UserGroup', index: true}],
    'therapeutic-areasID': [{type: Schema.Types.ObjectId, ref: 'therapeutic-areas',index: true}],
    thumbnail_path : String,
    title : {type:String,es_indexed:true},
    type : Number,
    pathologiesID: [{type: Schema.Types.ObjectId, ref: 'pathologies',index: true}]
});
multimediaSchema.plugin(mongoosastic,{host:my_config.elasticServer,port:my_config.elasticPORT});
module.exports = mongoose.model('multimedia', multimediaSchema,'multimedia');
var Multimedia = mongoose.model('multimedia', multimediaSchema,'multimedia');
multimediaSchema.index({last_updated: -1});
searchIndex.mongoosasticIndex(Multimedia);
mongoDbIndex.mongooseIndex(Multimedia);