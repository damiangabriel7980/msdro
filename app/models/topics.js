/**
 * Created by miricaandrei23 on 17.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var topicsSchema		= new Schema({
    name: String
});

module.exports = mongoose.model('topics', topicsSchema,'topics');