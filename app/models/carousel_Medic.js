var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var mongoDbIndex = require('../modules/mongooseIndex/index');
var deepPopulate = require('mongoose-deep-populate');

var carouselSchema		= new Schema({
    image_path: String,
    indexNumber: Number,
    title: String,
    enable:       Boolean,
    last_updated: Date,
    type: Number,
    article_id:   {type: Schema.Types.ObjectId, ref:'articles', index: true},
    redirect_to_href: String
});
carouselSchema.plugin(deepPopulate, {
    whitelist: ['article_id.groupsID']
});

module.exports = mongoose.model('carousel_Medic', carouselSchema,'carousel_Medic');
var Carousel = mongoose.model('carousel_Medic', carouselSchema,'carousel_Medic');
mongoDbIndex.mongooseIndex(Carousel);