/**
 * Created by miricaandrei23 on 15.10.2014.
 */
var mongoose		= require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema			= mongoose.Schema;

var ProductSchema		= new Schema({
    description: {type:String,es_indexed:true},
    enable:      Number,
    file_path:   String,
    image_path:  String,
    last_updated: Date,
    name: {type:String,es_indexed:true},
    'therapeutic-areasID': Array
});
//ProductSchema.plugin(mongoosastic);
module.exports = mongoose.model('products', ProductSchema);
