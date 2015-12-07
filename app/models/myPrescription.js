
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myPrescriptionSchema = new Schema({
  generalDescription:String,
  telefon:[{
    name:String,
    number:String
  }],
  termsOfUseUrl:String,
  privacyPolicyUrl:String
});

module.exports=mongoose.model('myPrescription',myPrescriptionSchema,'myPrescription');
