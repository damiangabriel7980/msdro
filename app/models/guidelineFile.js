/**
 * Created by user on 23.10.2015.
 */
var mongoose = require('mongoose');
var ModelInfos = require('../modules/modelInfos');
var Schema = mongoose.Schema;

var guidelineFileSchema = new Schema({
    guidelineFileUrl : String,
    displayName:String,
    actualName:String,
    type : {type:String,default:'PDF'},
    creationDate: Date,
    lastModified: Date,
    guidelineCategoryId:{type:Schema.Types.ObjectId,ref:'guidelineCategory'},
    guidelineCategoryName:String,
    enabled:{type:Boolean,default:true}
});

guidelineFileSchema.pre('save',function(next){
    this.last_modified = Date.now();
    ModelInfos.recordLastUpdate("guideline").then(function () {
        next();
    });
});


guidelineFileSchema.pre('remove',function(next){
    this.last_modified = Date.now();
    ModelInfos.recordLastUpdate("guideline").then(function () {
        next();
    });
});








module.exports = mongoose.model('guidelineFile',guidelineFileSchema,'guidelineFile');