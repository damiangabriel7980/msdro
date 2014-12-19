/**
 * Created by miricaandrei23 on 17.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var threadsSchema		= new Schema({
    owner: {type: Schema.Types.ObjectId,ref: 'User'},
    question: String,
    date_recorded: Date,
    medics: [{type: Schema.Types.ObjectId,ref: 'User'}],
    topics:[{type: Schema.Types.ObjectId,ref: 'topics'}],
    locked: {type: Schema.Types.ObjectId,ref: 'User'},
    id_messages:[{type: Schema.Types.ObjectId,ref: 'qa_messages'}]
});

module.exports = mongoose.model('qa_threads', threadsSchema,'qa_threads');