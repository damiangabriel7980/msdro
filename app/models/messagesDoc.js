/**
 * Created by miricaandrei23 on 20.01.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var MessagesDocSchema = new Schema({
    image_path:String,
    text: String,
    type: Number
});

module.exports = mongoose.model('messages_doc',MessagesDocSchema,'messages_doc');