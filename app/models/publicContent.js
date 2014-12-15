var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

//type: 1 = stire
//      2 = articol
//      3 = elearning
//      4 = download
var publicContentSchema		= new Schema({
    title:        String,
    author:       String,
    description:  String,
    text:         String,
    type:         Number,
    date_added:   Date,
    last_updated: Date,
    enable:       Boolean,
    image_path:   String,
    file_path:   String,
    'therapeutic-areasID': Array
});

module.exports = mongoose.model('public-content', publicContentSchema, 'public-content');