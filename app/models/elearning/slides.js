var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

var slidesSchema		= new Schema({
    content: String,
    image_paths: [{type: String}],
    last_updated: Date,
    date_created: Date,
    order: Number,
    video_paths: [{type: String}],
    "type": {type: String, enum: ["test", "slide"]},
    questions: [{type: Schema.Types.ObjectId, ref: 'elearning_questions'}]
});

slidesSchema.plugin(deepPopulate, {
    whitelist: ['questions','questions.answers']
});

module.exports = mongoose.model('elearning_slides', slidesSchema, 'elearning_slides');