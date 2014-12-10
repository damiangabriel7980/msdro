/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;


var ConferencesSchema		= new Schema({
    title:  String,
    enable:         String,
    begin_date:        Date,
    last_updated: Date,
    listTalks:[{type: Schema.Types.ObjectId,ref: 'talks'}]
});

module.exports = mongoose.model('conferences',ConferencesSchema,'conferences');