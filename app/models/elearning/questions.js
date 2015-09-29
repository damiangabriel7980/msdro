/**
 * Created by miricaandrei23 on 13.11.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

var questionsSchema		= new Schema({
    order : Number,
    text : String,
    answers: [{type: Schema.Types.ObjectId, ref: 'elearning_answers'}]
});

questionsSchema.plugin(deepPopulate, {
    whitelist: ['answers'],
    populate: {
        "answers": {
            options: {
                sort: {
                    "order": 1
                }
            }
        }
    }
});

module.exports = mongoose.model('elearning_questions', questionsSchema,'elearning_questions');
