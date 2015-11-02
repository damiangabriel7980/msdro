/**
 * Created by user on 23.10.2015.
 */
var mongoose = require ('mongoose');
var ModelInfos = require('../modules/modelInfos');
var Schema = mongoose.Schema;


var guidelineCategorySchema = new Schema({
    name: String,
    imageUrl: String,
    enabled:{type:Boolean,default:false},
    lastModified: Date,
    creationDate:Date,
    guidelineFileIds:[{type:Schema.Types.ObjectId , ref:'guidelineFile'}]
});

guidelineCategorySchema.pre('save',function(next){
    this.last_modified = Date.now();
    ModelInfos.recordLastUpdate("guideline").then(function () {
        next();
    });
});


guidelineCategorySchema.pre('remove',function(next){
    this.last_modified = Date.now();
    ModelInfos.recordLastUpdate("guideline").then(function () {
        next();
    });
});






module.exports = mongoose.model('guidelineCategory',guidelineCategorySchema,'guidelineCategory');