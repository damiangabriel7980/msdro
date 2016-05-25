/**
 * Created by andreimirica on 16.05.2016.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var brochuresSchema		= new Schema({
    title_image:        String,
    title:       String,
    text:  String,
    side_image:         String,
    last_updated: Date,
    enabled: Boolean,
    orderIndex: Number
});

module.exports = mongoose.model('brochureSections', brochuresSchema, 'brochureSections');