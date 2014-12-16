var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var chatMessagesSchema		= new Schema({
    room: String,
    username: String,
    message: String,
    date_written: Date
});

module.exports = mongoose.model('chat-messages', chatMessagesSchema, 'chat-messages');
