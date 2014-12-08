var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var carouselSchema		= new Schema({
    image_path: String,
    articleID: String,
    indexNumber: Number,
    title: String
});

module.exports = mongoose.model('carousel_Medic', carouselSchema,'carousel_Medic');
