var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

// link_type:
// 1 = to content
// 2 = to category
// 3 = to URL

var publicCarouselSchema		= new Schema({
    title:        String,
    description:  String,
    order_index:  Number,
    link_name:    {type: String, enum: ["content", "url"]},
    links: {
        content: {type: Schema.Types.ObjectId, ref: 'public-content'},
        url: String
    },
    image_path:   String,
    enable:       Boolean,
    last_updated: Date
});

module.exports = mongoose.model('public-carousel', publicCarouselSchema, 'public-carousel');