/**
 * Created by miricaandrei23 on 15.10.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var ProductSchema		= new Schema({
    version:     Number,
    description: String,
    enable:      Number,
    file_path:   String,
    image_path:  String,
    last_updated: Date,
    name: String,
    area_parent: Array
});

module.exports = mongoose.model('Products', ProductSchema);
