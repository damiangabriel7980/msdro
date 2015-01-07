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
    entity : Number,
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
//quizSchema.plugin(mongoosastic);
module.exports = mongoose.model('quizes', quizSchema,'quizes');
