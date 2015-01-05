var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var qa_answerGiversSchema		= new Schema({
    nickname: String,
    id_user: {type: Schema.Types.ObjectId,ref: 'User'}
});

module.exports = mongoose.model('qa_answerGivers', qa_answerGiversSchema,'qa_answerGivers');