/**
 * Created by miricaandrei23 on 13.11.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var questionsSchema		= new Schema({
    answersID : Array,
    last_updated : Date,
    points : Number,
    text : String
});

module.exports = mongoose.model('questions', questionsSchema,'questions');
