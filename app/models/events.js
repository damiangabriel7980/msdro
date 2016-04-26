/**
 * Created by miricaandrei23 on 28.10.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var mongoosastic = require('mongoosastic');
var Conferences=require('./conferences');
var searchIndex = require('../modules/mongoosasticIndex/index');
var mongoDbIndex = require('../modules/mongooseIndex/index');

var Config = require('../../config/environment.js'),
    my_config = new Config();

var EventsSchema		= new Schema({
    description:  {type:String, es_indexed:true},
    enable:         Boolean,
    end:        Date,
    groupsID: [{type: Schema.Types.ObjectId, ref: 'UserGroup', index: true}],
    last_updated: Date,
    name:      {type:String,es_indexed:true},
    place:       String,
    isPublic:   Boolean,
    start: {type: Date, index: true},
    type: Number,
    listconferences:[{type: Schema.Types.ObjectId,ref: 'conferences'}],
    pathologiesID: [{type: Schema.Types.ObjectId, ref: 'pathologies',index: true}]
});
EventsSchema.plugin(mongoosastic,{host:my_config.elasticServer,port:my_config.elasticPORT});

module.exports = mongoose.model('calendar-events', EventsSchema,'calendar-events');
var Event = mongoose.model('calendar-events', EventsSchema,'calendar-events');
EventsSchema.index({start: 1});
searchIndex.mongoosasticIndex(Event);
mongoDbIndex.mongooseIndex(Event);

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