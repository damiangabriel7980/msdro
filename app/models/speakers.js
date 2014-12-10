/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;


var SpeakersSchema		= new Schema({
    first_name:  String,
    last_name:         String,
    profession:        String,
    last_updated: Date,
    workplace:       String,
    short_description:   String,
    listTalks:[{type: Schema.Types.ObjectId,ref: 'talks'}]
});

module.exports = mongoose.model('speakers',SpeakersSchema,'speakers');