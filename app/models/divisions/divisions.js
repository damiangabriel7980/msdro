var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {type: String},
    code: {type: String},
    lastUpdated: {type: Date, default: Date.now}

});

module.exports = mongoose.model('divisions', schema, 'divisions');