/**
 * Created by miricaandrei23 on 17.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var qa_messagesSchema		= new Schema({
    message_text: String,
    type: Number,
    owner: {type: Schema.Types.ObjectId,ref: 'User'}
});

module.exports = mongoose.model('qa_messages', qa_messagesSchema,'qa_messages');