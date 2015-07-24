var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

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