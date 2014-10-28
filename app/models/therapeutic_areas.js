/**
 * Created by miricaandrei23 on 15.10.2014.
 */
/**
 * Created by miricaandrei23 on 15.10.2014.
 */
var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var therapeuticAreaSchema		= new Schema({
    version_ther:     Number,
    has_children: Number,
    last_updated: Date,
    name: String,
    parent_id: String,
    enable:      Number,
    products :[
    {type: Schema.Types.ObjectId, ref: 'Products'}
]
});

module.exports = mongoose.model('therapeuticAreas', therapeuticAreaSchema);
