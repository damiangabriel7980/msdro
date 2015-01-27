/**
 * Created by miricaandrei23 on 20.01.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var ChatDocSchema = new Schema({
    post:{type: Schema.Types.ObjectId,ref:'MSDDoc_news_post'},
    participants: [{type: Schema.Types.ObjectId,ref: 'User'}],
    created:Date
});

module.exports = mongoose.model('MSDDoc_chat',ChatDocSchema,'MSDDoc_chat');