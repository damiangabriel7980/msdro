/**
 * Created by miricaandrei23 on 15.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var RoomsSchema = new Schema({
    room_name:  String,
    qr_code:       Object,
    event: {type: Schema.Types.ObjectId, ref: 'calendar-events', index: true},
    id_threads:[{type: Schema.Types.ObjectId, ref: 'threads'}]
});

module.exports = mongoose.model('rooms',RoomsSchema,'rooms');
var room = mongoose.model('rooms', RoomsSchema,'rooms');
room.ensureIndexes(function (err) {
    if (err)
        console.log(err);
});
room.on('index', function (err) {
    if (err)
        console.log(err); // error occurred during index creation
});