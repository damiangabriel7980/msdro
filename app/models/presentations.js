var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoDbIndex = require('../modules/mongooseIndex/index');

var presentationSchema = new Schema({
    description: String,
    article_content: String,
    groupsID: [{type: Schema.Types.ObjectId, ref: 'UserGroup', index: true}],
    enabled:Boolean
});

module.exports = mongoose.model('presentations', presentationSchema,'presentations');
var Presentation = mongoose.model('presentations', presentationSchema,'presentations');
mongoDbIndex.mongooseIndex(Presentation);
