/**
 * Created by miricaandrei23 on 12.02.2015.
 */
/**
 * Created by miricaandrei23 on 12.02.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var mongoDbIndex = require('../modules/mongooseIndex/index');

var specialProductGlossarySchema		= new Schema({
    keyword: String,
    description: String,
    product:{type: Schema.Types.ObjectId,ref: 'specialProducts', index: true}
});
module.exports = mongoose.model('specialProducts_glossary', specialProductGlossarySchema,'specialProducts_glossary');
var specialProductGlossary = mongoose.model('specialProducts_glossary', specialProductGlossarySchema,'specialProducts_glossary');
mongoDbIndex.mongooseIndex(specialProductGlossary);