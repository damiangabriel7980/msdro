/**
 * Created by miricaandrei23 on 20.01.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var ChatDocSchema = new Schema({
    message_ids:[{type: Schema.Types.ObjectId,ref:'messages_doc'}],
    post_id:{type: Schema.Types.ObjectId,ref:'news_post'},
    chat_receiver: {type: Schema.Types.ObjectId,ref: 'User'},
    chat_sender: {type: Schema.Types.ObjectId,ref: 'User'},
    last_updated:Date
});

module.exports = mongoose.model('chat_doc',ChatDocSchema,'chat_doc');