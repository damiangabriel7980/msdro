/**
 * Created by miricaandrei23 on 12.02.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var specialProductDetailsSchema		= new Schema({
    title: String,
    description: String,
    header_title: String,
    header_image:String,
    children_ids:[{type: Schema.Types.ObjectId,ref: 'specialProducts_Menu'}],
    product:{type: Schema.Types.ObjectId,ref: 'specialProducts', index: true},
    order_index: Number,
    show_safety_info: Boolean,
    show_prescription: Boolean
});
module.exports = mongoose.model('specialProducts_Menu', specialProductDetailsSchema,'specialProducts_Menu');
var specialProductMenu = mongoose.model('specialProducts_Menu', specialProductDetailsSchema,'specialProducts_Menu');
specialProductDetailsSchema.index({order_index: 1});
specialProductMenu.ensureIndexes(function (err) {
    if (err)
        console.log(err);
});
specialProductMenu.on('index', function (err) {
    if (err)
        console.log(err); // error occurred during index creation
});