var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var schema		= new Schema({
    "type": {type: String, enum: ["manager", "rep", "medic"]},
    name: String,
    city: {type: Schema.Types.ObjectId, ref: 'cities'},
    phone: String,
    users: {type: Schema.Types.ObjectId, ref: 'januvia_users'},
    date_created: Date,
    last_modified: Date
});

schema.pre('save', function (next) {
    this.last_modified = Date.now();
    next();
});

module.exports = mongoose.model('januvia_users', schema);