/**
 * Created by miricaandrei23 on 20.01.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var MessagesDocSchema = new Schema({
    image:String,
    text: String,
    created:Date,
    read: Boolean,
    chat:{type: Schema.Types.ObjectId,ref:'MSDDoc_chat'},
    owner: {type: Schema.Types.ObjectId,ref:'User'}
});

module.exports = mongoose.model('MSDDoc_messages',MessagesDocSchema,'MSDDoc_messages');