/**
 * Created by miricaandrei23 on 12.02.2015.
 */
/**
 * Created by miricaandrei23 on 12.02.2015.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var specialProductFilesSchema		= new Schema({
    filename: String,
    size: String,
    type: String,
    description: String,
    file_path:String,
    product:{type: Schema.Types.ObjectId,ref: 'specialProducts'}
});
module.exports = mongoose.model('specialProducts_files', specialProductFilesSchema,'specialProducts_files');