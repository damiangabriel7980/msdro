/**
 * Created by user on 23.10.2015.
 */
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
var mongoDbIndex = require('../modules/mongooseIndex/index');

var guidelineCategorySchema = new Schema({
    name: String,
    displayName:String,
    imageUrl: String,
    isEnabled:Boolean,
    lastModified: Date,
    creationDate:Date,
    guidelineFileIds:[{type:Schema.Types.ObjectId , ref:'guidelineFile',index:true}]
});

module.exports = mongoose.model('guidelineCategory',guidelineCategorySchema,'guidelineCategory');