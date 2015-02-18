/**
 * Created by miricaandrei23 on 12.02.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var specialProductDetailsSchema		= new Schema({
    title: String,
    description: String,
    has_children: Boolean,
    image_title: String,
    image_title_text:String,
    children_ids:[{type: Schema.Types.ObjectId,ref: 'specialProducts_Menu'}],
    product:{type: Schema.Types.ObjectId,ref: 'specialProducts'}
});
module.exports = mongoose.model('specialProducts_Menu', specialProductDetailsSchema,'specialProducts_Menu');