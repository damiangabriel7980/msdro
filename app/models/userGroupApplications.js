var mongoose		= require('mongoose');
var deepPopulate = require('mongoose-deep-populate');
var Schema			= mongoose.Schema;
var mongoDbIndex = require('../modules/mongooseIndex/index');

var schema		= new Schema({
    name: String,
    url:   String,
    isEnabled: Boolean,
    groups: [{type: Schema.Types.ObjectId, ref: 'UserGroup', index: true}],
    code: String,
    logo_path: String
});

schema.plugin(deepPopulate, {
    whitelist: ['groups.profession']
});

module.exports = mongoose.model('groupsApplications', schema, 'groupsApplications');
var specialApps = mongoose.model('groupsApplications', schema,'groupsApplications');
mongoDbIndex.mongooseIndex(specialApps);