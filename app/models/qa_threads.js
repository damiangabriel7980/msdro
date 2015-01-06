/**
 * Created by miricaandrei23 on 17.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var threadsSchema		= new Schema({
    owner: {type: Schema.Types.ObjectId,ref: 'User'},
    ownerDisplay: String,
    question: String,
    date_recorded: Date,
    medics: [{type: Schema.Types.ObjectId,ref: 'qa_answerGivers'}],
    topics:[{type: Schema.Types.ObjectId,ref: 'qa_topics'}],
    locked: {type: Schema.Types.ObjectId,ref: 'qa_answerGivers'},
    messages:[{type: Schema.Types.ObjectId,ref: 'qa_messages'}],
    answered: Boolean
});

module.exports = mongoose.model('qa_threads', threadsSchema,'qa_threads');