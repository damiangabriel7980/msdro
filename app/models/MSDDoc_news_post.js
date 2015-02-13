/**
 * Created by miricaandrei23 on 20.01.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var NewsPostSchema = new Schema({
    title: String,
    message:String,
    created:Date,
    image: String,
    owner: {type: Schema.Types.ObjectId,ref: 'User'}
});

module.exports = mongoose.model('MSDDoc_news_post',NewsPostSchema,'MSDDoc_news_post');