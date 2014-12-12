/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var Talks= require('./talks');

var ConferencesSchema		= new Schema({
    title:  String,
    enable:         String,
    begin_date:        Date,
    last_updated: Date,
    listTalks:[{type: Schema.Types.ObjectId,ref: 'talks'}]
});

ConferencesSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    console.log(this.listTalks);
    Talks.remove({_id: {$in: this.listTalks}}).exec(function(){
        next();
    });
});

module.exports = mongoose.model('conferences',ConferencesSchema,'conferences');