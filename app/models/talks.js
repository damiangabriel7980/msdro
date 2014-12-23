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
    conference:    {type: Schema.Types.ObjectId, ref: 'conferences'},
    room:    {type: Schema.Types.ObjectId, ref: 'rooms'},
    speakers: [{type: Schema.Types.ObjectId,ref: 'speakers'}],
    type: Number
});

module.exports = mongoose.model('talks',TalksSchema,'talks');