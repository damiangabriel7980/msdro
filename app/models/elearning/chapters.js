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
    listSubChapters : [{type: Schema.Types.ObjectId, ref: 'elearning_subchapters'}],
    duration: Number
});

ChapterSchema.plugin(deepPopulate, {});

module.exports = mongoose.model('elearning_chapters', ChapterSchema, 'elearning_chapters');
