var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

//type: 1 = normal
//      2 = legislativ
//      3 = stiintific
var articlesSchema		= new Schema({
    title:        String,
    author:       String,
    description:  String,
    text:         String,
    type:         Number,
    last_updated: Date,
    version:      Number,
    enable:       Boolean,
    image_path:   String,
    groupsID:     Array
});

module.exports = mongoose.model('articles', articlesSchema);