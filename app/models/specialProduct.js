/**
 * Created by miricaandrei23 on 12.02.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var specialProductSchema		= new Schema({
    prescription: String,
    safety_information: String,
    logo_path:String,
    header_image:String,
    product_name: String,
    general_description:String,
    groups: [{type: Schema.Types.ObjectId,ref: 'UserGroup'}],
    enabled: Boolean
});
module.exports = mongoose.model('specialProducts', specialProductSchema,'specialProducts');