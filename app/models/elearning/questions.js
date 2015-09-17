/**
 * Created by miricaandrei23 on 13.11.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var questionsSchema		= new Schema({
    order : Number,
    text : String
});

module.exports = mongoose.model('elearning_questions', questionsSchema,'elearning_questions');
