/**
 * Created by miricaandrei23 on 28.10.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var EventsSchema		= new Schema({
    version:        Number,
    description:  String,
    enable:         String,
    end:        Date,
    last_updated: Date,
    name:      String,
    place:       String,
    privacy:   String,
    start: Date,
    type: Number,
    group_ident: String
});

module.exports = mongoose.model('Events', EventsSchema);