/**
 * Created by miricaandrei23 on 20.01.2015.
 */
var mongoose		= require('mongoose');
var deepPopulate = require('mongoose-deep-populate');
var Schema			= mongoose.Schema;

var ChatDocSchema = new Schema({
    post:{type: Schema.Types.ObjectId,ref:'MSDDoc_news_post'},
    participants: [{type: Schema.Types.ObjectId,ref: 'User'}],
    subscribers: [{type: Schema.Types.ObjectId,ref: 'User'}],
    last_message: {type: Schema.Types.ObjectId,ref: 'MSDDoc_messages'},
    created:Date
});

ChatDocSchema.plugin(deepPopulate, {
    whitelist: ['post.owner','participants','last_message']
});

module.exports = mongoose.model('MSDDoc_chat',ChatDocSchema,'MSDDoc_chat');