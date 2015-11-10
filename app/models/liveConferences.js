/**
 * Created by andreimirica on 09.11.2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LiveConferencesSchema = new Schema({
    name: String,
    description: String,
    location: String,
    image_path: String,
    date: Date,
    therapeuticAreas: Array,
    enabled: Boolean,
    speakers: {
        registered: [{type: Schema.Types.ObjectId, ref:'User'}],
        unregistered: [{
            name: String,
            username: String
        }]
    } ,
    viewers: {
        registered: [{type: Schema.Types.ObjectId, ref:'User'}],
        unregistered: [{
            name: String,
            username: String
        }]
    }
});

module.exports = mongoose.model('liveConferences', LiveConferencesSchema,'liveConferences');
