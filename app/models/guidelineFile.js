/**
 * Created by user on 23.10.2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var guidelineFileSchema = new Schema({
    guidelineFileUrl : String,
    displayName:String,
    type : {type:String,default:'PDF'},
    creationDate: Date,
    lastModified: Date,
    guidelineCategoryId:{type:Schema.Types.ObjectId,ref:'guidelineCategory'}
});

module.exports = mongoose.model('guidelineFile',guidelineFileSchema,'guidelineFile');