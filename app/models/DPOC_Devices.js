var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var SHA512   = require('crypto-js/sha512');

var schema		= new Schema({
    name: { type: String, required: true, unique: true},
    uuid: String,
    code: { type: String, required: true },
    isEnabled: Boolean
});

// generating a hash
schema.methods.generateHash = function(str) {
    return SHA512(str).toString();
};

module.exports = mongoose.model('DPOC_Devices', schema, 'DPOC_Devices');