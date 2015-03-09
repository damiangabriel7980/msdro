var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var schema		= new Schema({
    profession: {type: Schema.Types.ObjectId, ref: 'professions'},
    value: {type: String, select: false}
});

module.exports = mongoose.model('ActivationCodes', schema, 'activationCodes');