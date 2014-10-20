var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

//type: 1 = normal
//      2 = legislativ
//      3 = stiintific
var ContentSchema		= new Schema({
    title:        String,
    author:       String,
    description:  String,
    text:         String,
    type:         Number,
    last_updated: Date,
    version:      Number,
    enable:       Number,
    image_path:   String
});

module.exports = mongoose.model('Content', ContentSchema);