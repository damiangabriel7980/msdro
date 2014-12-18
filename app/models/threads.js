/**
 * Created by miricaandrei23 on 17.12.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var threadsSchema		= new Schema({
    sender: {type: Schema.Types.ObjectId,ref: 'User'},
    receiver: {type: Schema.Types.ObjectId,ref: 'User'},
    blocked: Boolean,
    topic:{type: Schema.Types.ObjectId,ref: 'topics'},
    id_messages:[{type: Schema.Types.ObjectId,ref: 'qa_messages'}]
});

module.exports = mongoose.model('threads', threadsSchema,'threads');