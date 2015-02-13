/**
 * Created by miricaandrei23 on 12.02.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var specialProductSchema		= new Schema({
    prescription: String,
    default_description: String,
    image_thumbnail:String,
    product_name: String
});
module.exports = mongoose.model('specialProducts', specialProductSchema,'specialProducts');