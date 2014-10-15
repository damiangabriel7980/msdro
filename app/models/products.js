/**
 * Created by miricaandrei23 on 15.10.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var ProductSchema		= new Schema({
    version_prod:     Number,
    description: String,
    enableP:      Number,
    file_path:   String,
    image_path:  String,
    last_updated: Date,
    nameP: String
});

module.exports = mongoose.model('Products', ProductSchema);
