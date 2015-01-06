/**
 * Created by miricaandrei23 on 17.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

// type:
// 1 = question  /  2 = answer

var qa_messagesSchema		= new Schema({
    text: String,
    type: Number,
    date_recorded: Date,
    owner: {type: Schema.Types.ObjectId,ref: 'User'},
    ownerDisplay: String
});

module.exports = mongoose.model('qa_messages', qa_messagesSchema,'qa_messages');