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
    default_group: Number,
    show_at_signup: Boolean,
    content_specific: Boolean,
    restrict_CRUD: Boolean,
    profession: {type: Schema.Types.ObjectId,ref: 'professions'}
});

module.exports = mongoose.model('UserGroup', UserGroupSchema, 'groups');