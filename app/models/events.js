/**
 * Created by miricaandrei23 on 28.10.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;


var EventsSchema		= new Schema({
    description:  String,
    enable:         String,
    end:        Date,
    groupsID: Array,
    last_updated: Date,
    name:      String,
    place:       String,
    privacy:   String,
    start: Date,
    type: Number
});

module.exports = mongoose.model('calendar-events', EventsSchema);