var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var schema		= new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    uuid: { type: String, required: true, unique: true, trim: true }
});

module.exports = mongoose.model('DPOC_Devices', schema, 'DPOC_Devices');