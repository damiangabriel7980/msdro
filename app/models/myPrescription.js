
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myPrescriptionSchema = new Schema({
  generalDescription:String,
  telefon:[{
    nume:String,
    numar:String
  }],
  termsOfUseUrl:String,
  privacyPolicyUrl:String
});

module.exports=mongoose.model('myPrescription',myPrescriptionSchema,'myPrescription');
