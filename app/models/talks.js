/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var TalksSchema		= new Schema({
    description:  String,
    enable:         String,
    hour_start: Date,
    hour_end:        Date,
    last_updated: Date,
    title:      String,
    place:       String,
    listSpeakers:[{type: Schema.Types.ObjectId,ref: 'speakers'}],
    listRooms:[{type: Schema.Types.ObjectId,ref: 'rooms'}]
});

module.exports = mongoose.model('talks',TalksSchema,'talks');