/**
 * Created by miricaandrei23 on 13.11.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var answersSchema		= new Schema({
    ratio : Number,
    text : String,
    question : {type: Schema.Types.ObjectId, ref: 'elearning_questions'}
});

module.exports = mongoose.model('elearning_answers', answersSchema,'elearning_answers');
