/**
 * Created by user on 02.10.2015.
 */
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var appUpdateSchema = new Schema({
    name : String,
    downloadUrl: String,
    upgradeDate:Date
});

module.exports = mongoose.model('msd-applications',appUpdateSchema,'msd-applications');