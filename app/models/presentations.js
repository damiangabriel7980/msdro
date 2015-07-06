var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var presentationSchema = new Schema({
    description: String,
    article_content: String,
    groupsID: [{type: String, ref: 'UserGroup', index: true}],
    enabled:Boolean
});

module.exports = mongoose.model('presentations', presentationSchema,'presentations');
var Presentation = mongoose.model('presentations', presentationSchema,'presentations');
Presentation.ensureIndexes(function (err) {
    if (err)
        console.log(err);
});
Presentation.on('index', function (err) {
    if (err)
        console.log(err); // error occurred during index creation
});
