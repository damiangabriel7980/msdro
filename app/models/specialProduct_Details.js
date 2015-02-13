/**
 * Created by miricaandrei23 on 12.02.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var specialProductDetailsSchema		= new Schema({
    title: String,
    description: String,
    images: Array,
    has_children: Boolean,
    image_title: String,
    children_ids:[{type: Schema.Types.ObjectId,ref: 'specialProducts_Details'}],
    id_product:{type: Schema.Types.ObjectId,ref: 'specialProducts'}
});
module.exports = mongoose.model('specialProducts_Details', specialProductDetailsSchema,'specialProducts_Details');