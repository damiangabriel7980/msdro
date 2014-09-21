var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var PersonSchema		= new Schema({
    type:        String,
    name:       String,
    surname:    String,
    birthDate:  Date,
    picture:    Buffer
});

module.exports = mongoose.model('Person', PersonSchema);