/**
 * Created by miricaandrei23 on 12.02.2015.
 */
/**
 * Created by miricaandrei23 on 12.02.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var specialProductGlossarySchema		= new Schema({
    keyword: String,
    description: String,
    id_product:{type: Schema.Types.ObjectId,ref: 'specialProducts'}
});
module.exports = mongoose.model('specialProducts_glossary', specialProductGlossarySchema,'specialProducts_glossary');