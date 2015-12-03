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
    last_modified : Date,
    enabled: Boolean,
    speakers: [{
        name: String,
        username: String,
        invited: Boolean
    }] ,
    viewers: [{
        name: String,
        username: String,
        invited: Boolean
    }],
    moderator: {
        name: String,
        username: String,
        invited: Boolean
    },
    'therapeutic-areasID': [{type: Schema.Types.ObjectId, ref: 'therapeutic-areas', index: true}]
},{ minimize: false });

module.exports = mongoose.model('liveConferences', LiveConferencesSchema,'liveConferences');
