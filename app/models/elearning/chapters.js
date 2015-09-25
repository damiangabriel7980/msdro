/**
 * Created by Administrator on 16/09/15.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

var Config = require('../../../config/environment.js'),
    my_config = new Config();

var ChapterSchema		= new Schema({
    title: String,
    last_updated: Date,
    date_created: Date,
    description: String,
    order: Number,
    listSubchapters : [{type: Schema.Types.ObjectId, ref: 'elearning_subchapters'}],
    duration: Number
});

ChapterSchema.plugin(deepPopulate, {
    whitelist: ["listSubchapters.listSlides.questions.answers"],
    populate: {
        "listSubchapters": {
            options: {
                sort: {
                    "order": 1
                }
            }
        },
        "listSubchapters.listSlides": {
            options: {
                sort: {
                    "order": 1
                }
            }
        },
        "listSubchapters.questions": {
            options: {
                sort: {
                    "order": 1
                }
            }
        },
        "listSubchapters.answers": {
            options: {
                sort: {
                    "order": 1
                }
            }
        }
    }
});

module.exports = mongoose.model('elearning_chapters', ChapterSchema, 'elearning_chapters');
