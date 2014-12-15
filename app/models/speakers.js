/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var Talks = require('./talks');
var Conferences = require('./conferences');

var SpeakersSchema		= new Schema({
    first_name:  String,
    last_name:         String,
    profession:        String,
    last_updated: Date,
    workplace:       String,
    short_description:   String,
    listTalks:[{type: Schema.Types.ObjectId,ref: 'talks'}]
});

SpeakersSchema.pre('remove', function(next) {
    Talks.find({listSpeakers: {$in : this._id}},function(err,resp){
        for(var i=0;i<resp.length;i++){
                    var index = resp.indexOf(this._id);
                    resp[i].listSpeakers.splice(index,1);
                }
        next();
    })
});


module.exports = mongoose.model('speakers',SpeakersSchema,'speakers');