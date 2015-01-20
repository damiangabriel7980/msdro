/**
 * Created by miricaandrei23 on 20.01.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var NewsPostSchema = new Schema({
    title: String,
    short_description:String,
    image_path: String,
    owner_post: {type: Schema.Types.ObjectId,ref: 'User'},
    chat_id: {type: Schema.Types.ObjectId,ref: 'chat_doc'}
});

module.exports = mongoose.model('news_post',NewsPostSchema,'news_post');