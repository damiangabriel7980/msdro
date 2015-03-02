var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var presentationSchema = new Schema({
    description: String,
    article_content: String,
    groupsID: [{type: String, ref: 'UserGroup'}]
});

module.exports = mongoose.model('presentations', presentationSchema,'presentations');
