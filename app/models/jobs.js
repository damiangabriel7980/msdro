var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jobsSchema = new Schema({
    job_type: Number, // 1 = Spital; 2 = CMI; 3 = Policlinica; 4 = Farmacie
    job_name: String,
    street_name: String,
    street_number: String,
    postal_code: String,
    job_address: String
});

module.exports = mongoose.model('Job', jobsSchema);
