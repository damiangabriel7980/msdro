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

carouselSchema.set('toJSON', { virtuals: true });

carouselSchema
    .virtual('type_name')
    .get(function () {
        if(this.redirect_to_href){
            return "Link";
        }else{
            switch(this.type){
                case 1: return "National"; break;
                case 2: return "International"; break;
                case 3: return "Stiintific"; break;
                default: return "Necunoscut"; break;
            }
        }
    });

carouselSchema.plugin(deepPopulate, {
    whitelist: ['article_id.groupsID']
});

module.exports = mongoose.model('carousel_Medic', carouselSchema,'carousel_Medic');
var Carousel = mongoose.model('carousel_Medic', carouselSchema,'carousel_Medic');
mongoDbIndex.mongooseIndex(Carousel);