var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var mongoosastic = require('mongoosastic');
var searchIndex = require('../../modules/mongoosasticIndex/index');
var mongoDbIndex = require('../../modules/mongooseIndex/index');
var deepPopulate = require('mongoose-deep-populate');

var Config = require('../../../config/environment.js'),
    my_config = new Config();

var CourseSchema		= new Schema({
    title: {type: String, es_indexed:true},
    last_updated: Date,
    date_created: Date,
    description: String,
    listChapters: [{type: Schema.Types.ObjectId, ref: 'elearning_chapters'}],
    duration: Number,
    order: Number,
    groupsID: [{type: Schema.Types.ObjectId, ref: 'UserGroup'}],
    image_path: String
});

CourseSchema.plugin(mongoosastic,{host:my_config.elasticServer,port:my_config.elasticPORT});
CourseSchema.plugin(deepPopulate, {
	whitelist: ["listChapters.listSubchapters.listSlides" , "listChapters.listSubchapters.listSlides.questions.answers"],
	populate: {
		"listChapters": {
            options: {
                sort: {
                    "order": 1
                }
            }
        },
        "listChapters.listSubchapters": {
            options: {
                sort: {
                    "order": 1
                }
            }
        },
        "listChapters.listSlides": {
            options: {
                sort: {
                    "order": 1
                }
            }
        },
        "listChapters.questions": {
            options: {
                sort: {
                    "order": 1
                }
            }
        },
        "listChapters.answers": {
            options: {
                sort: {
                    "order": 1
                }
            }
        }
	}
});
module.exports = mongoose.model('elearning_courses', CourseSchema, 'elearning_courses');

var Course = mongoose.model('courses', CourseSchema,'courses');
CourseSchema.index({name: 1});
searchIndex.mongoosasticIndex(Course);
mongoDbIndex.mongooseIndex(Course);