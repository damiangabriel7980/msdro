var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var SHA512   = require('crypto-js/sha512');

var schema		= new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    uuid: { type: String, required: true, unique: true, trim: true },
    isEnabled: Boolean
});

// generating a hash
schema.methods.generateHash = function(uuid) {
    return SHA512(uuid).toString();
};

module.exports = mongoose.model('DPOC_Devices', schema, 'DPOC_Devices');