/**
 * Created by miricaandrei23 on 13.11.2014.
 */
/**
 * Created by miricaandrei23 on 12.11.2014.
 */
var mongoose		= require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema			= mongoose.Schema;

var quizSchema		= new Schema({
    description : {type:String,es_indexed:true},
    enabled : Boolean,
    entity : String,
    expired : Boolean,
    expiry_date : Date,
    last_updated : Date,
    no_of_exam_questions : Number,
    points : Number,
    questionsID : Array,
    time : Number,
    times : Number,
    title : {type:String,es_indexed:true},
    treshhold : Number
});
quizSchema.plugin(mongoosastic,{host:'10.200.0.221',port:'9200'});
module.exports = mongoose.model('quizes', quizSchema,'quizes');
var Quiz = mongoose.model('quizes', quizSchema,'quizes');
var stream = Quiz.synchronize();
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