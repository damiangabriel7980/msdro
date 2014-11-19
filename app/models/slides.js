var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var slidesSchema		= new Schema({
    description: String,
    image_path: String,
    last_updated: Date
});

module.exports = mongoose.model('slides', slidesSchema);