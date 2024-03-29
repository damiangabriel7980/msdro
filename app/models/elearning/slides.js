var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

var slidesSchema		= new Schema({
    content: String,
    last_updated: Date,
    date_created: Date,
    order: Number,
    "type": {type: String, enum: ["test", "slide"]},
    questions: [{type: Schema.Types.ObjectId, ref: 'elearning_questions'}],
    title: String,
    retake: Number,
    maximum: Number,
    minimum: Number,
    enabled: Boolean
});

slidesSchema.plugin(deepPopulate, {
    whitelist: ['questions','questions.answers'],
    populate: {
    	"questions": {
    		options: {
    			sort: {
    				"order": 1
    			}
    		}
    	}
    }
});

module.exports = mongoose.model('elearning_slides', slidesSchema, 'elearning_slides');