/**
 * Created by miricaandrei23 on 12.02.2015.
 */
/**
 * Created by miricaandrei23 on 12.02.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var specialProductqaSchema		= new Schema({
    answers:Array,
    text:String,
    id_product:{type: Schema.Types.ObjectId,ref: 'specialProducts'}
});
module.exports = mongoose.model('specialProducts_qa', specialProductqaSchema,'specialProducts_qa');