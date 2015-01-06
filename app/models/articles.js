var mongoose		= require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema			= mongoose.Schema;

//type: 1 = normal
//      2 = legislativ
//      3 = stiintific
var articlesSchema		= new Schema({
    title:        String,
    author:       String,
    description:  {type:String,es_indexed:true},
    text:         String,
    type:         Number,
    last_updated: Date,
    version:      Number,
    enable:       Boolean,
    image_path:   String,
    groupsID:     Array
});
articlesSchema.plugin(mongoosastic);
module.exports = mongoose.model('articles', articlesSchema);