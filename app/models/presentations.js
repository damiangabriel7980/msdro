var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var presentationSchema = new Schema({
    description: String,
    article_content: String,
    groupsID: [{type: String, ref: 'UserGroup'}],
    enabled:Boolean
});

module.exports = mongoose.model('presentations', presentationSchema,'presentations');
