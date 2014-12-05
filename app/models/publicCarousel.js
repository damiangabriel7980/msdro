var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

// type:
// 1 = News
// 2 = Articles
// 3 = Elearning
// 4 = Download
var publicCarouselSchema		= new Schema({
    title:        String,
    description:  String,
    order_index:  Number,
    type:         Number,
    content_id:   String,
    image_path:   String,
    enable:       Boolean
});

module.exports = mongoose.model('public-carousel', publicCarouselSchema, 'public-carousel');