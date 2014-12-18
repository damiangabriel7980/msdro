/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
//var Talks = require('./talks');
var Events = require('./cities');
var Talks=require('./talks');
var ConferencesSchema		= new Schema({
    title:  String,
    enable:         String,
    begin_date:        Date,
    last_updated: Date,
    listTalks:[{type: Schema.Types.ObjectId,ref: 'talks'}],
    qr_code: Object,
    description: String,
    end_date: Date,
    topicsID:[{type: Schema.Types.ObjectId,ref: 'topics'}]
});

ConferencesSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    console.log(this.listTalks);
    console.log(Events);
    //console.log(Talks);
    //Talks.remove({_id: {$in: this.listTalks}}).exec(function(){
    //    next();
    //});
    //Eveniment.find({listconferences: {$in: this._id}},function(err,resp){
    //    for(var i=0;i<resp.length;i++){
    //        var index = resp.indexOf(this._id);
    //        resp[i].listconferences.splice(index,1);
    //    }
    //
    //});

});

module.exports = mongoose.model('conferences',ConferencesSchema,'conferences');