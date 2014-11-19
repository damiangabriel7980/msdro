/**
 * Created by miricaandrei23 on 12.11.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

//type: 1 = video, 2 = slide

var multimediaSchema		= new Schema({
    author : String,
    description : String,
    enable : Boolean,
    file_path : String,
    groupsID : Array,
    last_updated : Date,
    points : Number,
    quizesID : Array,
    run_time: Number,
    "therapeutic-areasID" : Array,
    thumbnail_path : String,
    title : String,
    type : Number
});

module.exports = mongoose.model('multimedia', multimediaSchema,'multimedia');
