/**
 * Created by miricaandrei23 on 28.10.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var Conferences=require('./conferences');

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
    type: Number,
    listconferences:[{type: Schema.Types.ObjectId,ref: 'conferences'}]
});

module.exports = mongoose.model('calendar-events', EventsSchema,'calendar-events');

EventsSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    //console.log(Conferences);
    Conferences.find({_id:{$in: this.listconferences}},function(err,resp){
        //console.log(resp);
        for(var i=0;i<resp.length;i++)
        {
            resp[i].remove({_id: {$in: this.listconferences}},function(){

            });
        }
        next();
    });
});