var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var SHA512   = require('crypto-js/sha512');

var schema		= new Schema({
    name: { type: String, required: "required_name", unique: "name_unique"},
    uuid: String,
    code: { type: String, required: "required_code", unique: "code_unique"},
    email: { type: String, required: "required_email", unique: "email_unique" },
    isEnabled: Boolean
});

// generating a hash
schema.methods.generateHash = function(str) {
    if(str){
        return SHA512(str).toString();
    }else{
        return null;
    }
};

module.exports = mongoose.model('DPOC_Devices', schema, 'DPOC_Devices');