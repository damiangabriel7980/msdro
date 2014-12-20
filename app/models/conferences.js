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
    qr_code: Object,
    description: String,
    end_date: Date,
    topicsID:[{type: Schema.Types.ObjectId,ref: 'topics'}],
    image_path:String
});

module.exports = mongoose.model('conferences',ConferencesSchema,'conferences');