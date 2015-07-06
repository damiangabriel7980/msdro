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
    product:{type: Schema.Types.ObjectId,ref: 'specialProducts', index: true}
});
module.exports = mongoose.model('specialProducts_glossary', specialProductGlossarySchema,'specialProducts_glossary');
var specialProductGlossary = mongoose.model('specialProducts_glossary', specialProductGlossarySchema,'specialProducts_glossary');
specialProductGlossary.ensureIndexes(function (err) {
    if (err)
        console.log(err);
});
specialProductGlossary.on('index', function (err) {
    if (err)
        console.log(err); // error occurred during index creation
});