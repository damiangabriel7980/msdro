/**
 * Created by miricaandrei23 on 13.11.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var answersSchema		= new Schema({
    correct : Boolean,
    last_updated : Date,
    text : String
});

module.exports = mongoose.model('answers', answersSchema,'answers');
