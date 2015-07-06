var mongoose		= require('mongoose');
var deepPopulate = require('mongoose-deep-populate');
var Schema			= mongoose.Schema;

var schema		= new Schema({
    name: String,
    url:   String,
    isEnabled: Boolean,
    groups: [{type: Schema.Types.ObjectId, ref: 'UserGroup', index: true}]
});

schema.plugin(deepPopulate, {
    whitelist: ['groups.profession']
});

module.exports = mongoose.model('groupsApplications', schema, 'groupsApplications');
var specialApps = mongoose.model('groupsApplications', schema,'groupsApplications');
specialApps.ensureIndexes(function (err) {
    if (err)
        console.log(err);
});
specialApps.on('index', function (err) {
    if (err)
        console.log(err); // error occurred during index creation
});