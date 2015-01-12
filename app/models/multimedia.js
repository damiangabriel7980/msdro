/**
 * Created by miricaandrei23 on 12.11.2014.
 */
var mongoose		= require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema			= mongoose.Schema;

//type: 1 = video, 2 = slide

var multimediaSchema		= new Schema({
    author : String,
    description : {type:String,es_indexed:true},
    enable : Boolean,
    file_path : String,
    groupsID : Array,
    last_updated : Date,
    points : Number,
    quizesID : Array,
    run_time: Number,
    "therapeutic-areasID" : Array,
    thumbnail_path : String,
    title : {type:String,es_indexed:true},
    type : Number
});
multimediaSchema.plugin(mongoosastic,{host:'10.200.0.221',port:'9200'});
module.exports = mongoose.model('multimedia', multimediaSchema,'multimedia');
var Multimedia = mongoose.model('multimedia', multimediaSchema,'multimedia');
var stream = Multimedia.synchronize();
var count = 0;
stream.on('data', function(err, doc){
    count++;
});
stream.on('close', function(){
    console.log('indexed ' + count + ' documents!');
});
stream.on('error', function(err){
    console.log(err);
});