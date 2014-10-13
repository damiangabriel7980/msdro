var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var ContentSchema		= new Schema({
    title:       String,
    author:      String,
    description: String,
    text:        String,
    type:        Number,
    lastUpdated: Date
});

module.exports = mongoose.model('Content', ContentSchema);