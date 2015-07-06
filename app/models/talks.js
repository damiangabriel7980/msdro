/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var TalksSchema		= new Schema({
    description:  String,
    enable:         Boolean,
    hour_start: Date,
    hour_end:        Date,
    last_updated: Date,
    title:      String,
    place:       String,
    conference:    {type: Schema.Types.ObjectId, ref: 'conferences', index: true},
    room:    {type: Schema.Types.ObjectId, ref: 'rooms', index: true},
    speakers: [{type: Schema.Types.ObjectId,ref: 'speakers'}],
    type: Number
});

module.exports = mongoose.model('talks',TalksSchema,'talks');

var talks = mongoose.model('talks', TalksSchema,'talks');
talks.ensureIndexes(function (err) {
    if (err)
        console.log(err);
});
talks.on('index', function (err) {
    if (err)
        console.log(err); // error occurred during index creation
});