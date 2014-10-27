/**
 * Created by andrei on 27.10.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var UserGroupSchema		= new Schema({
    version:      Number,
    display_name: String,
    description:  String,
    image_path:   String,
    defaultGroup: Boolean
});

module.exports = mongoose.model('UserGroup', UserGroupSchema);