var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var ProfessionsSchema		= new Schema({
    display_name: String,
    description:  String,
    image_path:   String
});

module.exports = mongoose.model('professions', ProfessionsSchema, 'professions');