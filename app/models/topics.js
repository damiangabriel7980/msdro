/**
 * Created by miricaandrei23 on 17.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var topicsSchema		= new Schema({
    topic_name: String
});

module.exports = mongoose.model('topics', topicsSchema,'topics');