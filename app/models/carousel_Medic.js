var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var carouselSchema		= new Schema({
    image_path: String,
    indexNumber: Number,
    title: String,
    enable:       Boolean,
    last_updated: Date,
    type: Number,
    article_id:   {type:String,ref:'articles'},
    redirect_to_href: String
});

module.exports = mongoose.model('carousel_Medic', carouselSchema,'carousel_Medic');
