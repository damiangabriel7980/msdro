/**
 * Created by andreimirica on 09.11.2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LiveConferencesSchema = new Schema({
    name: String,
    description: String,
    location: String,
    image: String,
    date: Date,
    therapeuticAreas: Array,
    enabled: Boolean,
    speakers: [{type: Schema.Types.ObjectId, ref:'User'}],
    viewers: [{type: Schema.Types.ObjectId, ref:'User'}]
});

module.exports = mongoose.model('liveConferences', LiveConferencesSchema,'liveConferences');
