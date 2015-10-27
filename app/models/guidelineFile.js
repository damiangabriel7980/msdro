/**
 * Created by user on 23.10.2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var guidelineFileSchema = new Schema({
    guidelineFileUrl : String,
    displayName:String,
    actualName:String,
    type : {type:String,default:'PDF'},
    creationDate: Date,
    lastModified: Date,
    guidelineCategoryId:{type:Schema.Types.ObjectId,ref:'guidelineCategory'},
    enabled:{type:Boolean,default:true}
});

module.exports = mongoose.model('guidelineFile',guidelineFileSchema,'guidelineFile');