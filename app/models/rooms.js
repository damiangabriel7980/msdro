/**
 * Created by miricaandrei23 on 15.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var RoomsSchema = new Schema({
    room_name:  String,
    id_talks:         [{type: Schema.Types.ObjectId,ref: 'talks'}],
    id_conference:    {type: Schema.Types.ObjectId, ref: 'conferences'},
    qr_code:       Object,
    id_threads:[{type: Schema.Types.ObjectId, ref: 'threads'}]
});

module.exports = mongoose.model('rooms',RoomsSchema,'rooms');