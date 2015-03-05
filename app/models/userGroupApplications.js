var mongoose		= require('mongoose');
var deepPopulate = require('mongoose-deep-populate');
var Schema			= mongoose.Schema;

var schema		= new Schema({
    name: String,
    url:   String,
    isEnabled: Boolean,
    groups: [{type: Schema.Types.ObjectId, ref: 'UserGroup'}]
});

schema.plugin(deepPopulate, {
    whitelist: ['groups.profession']
});

module.exports = mongoose.model('groupsApplications', schema, 'groupsApplications');