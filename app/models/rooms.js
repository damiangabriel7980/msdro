/**
 * Created by miricaandrei23 on 15.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var RoomsSchema = new Schema({
    room_name:  String,
    qr_code:       Object,
    event: {type: Schema.Types.ObjectId, ref: 'calendar-events'},
    id_threads:[{type: Schema.Types.ObjectId, ref: 'threads'}]
});

module.exports = mongoose.model('rooms',RoomsSchema,'rooms');