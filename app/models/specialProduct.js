/**
 * Created by miricaandrei23 on 12.02.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var specialProductSchema		= new Schema({
    prescription: String,
    safety_information: String,
    image_thumbnail:String,
    product_name: String,
    general_description:String,
    group: {type: Schema.Types.ObjectId,ref: 'UserGroup'}
});
module.exports = mongoose.model('specialProducts', specialProductSchema,'specialProducts');