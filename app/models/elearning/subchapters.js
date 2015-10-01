/**
 * Created by Administrator on 16/09/15.
 */
/**
 * Created by Administrator on 16/09/15.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

var Config = require('../../../config/environment.js'),
    my_config = new Config();

var SubChapterSchema		= new Schema({
    title: String,
    last_updated: Date,
    date_created: Date,
    description: String,
    listSlides : [{type: Schema.Types.ObjectId, ref: 'elearning_slides'}],
    duration: Number,
    order: Number,
    enabled: Boolean
});

SubChapterSchema.plugin(deepPopulate, {
    whitelist: ["listSlides.questions.answers"],
    populate: {
        "listSlides": {
            options: {
                sort: {
                    "order": 1
                }
            }
        },
        "listSlides.questions": {
            options: {
                sort: {
                    "order": 1
                }
            }
        },
        "listSlides.answers": {
            options: {
                sort: {
                    "order": 1
                }
            }
        }
    }
});

module.exports = mongoose.model('elearning_subchapters', SubChapterSchema, 'elearning_subchapters');