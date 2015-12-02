
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myPrescriptionSchema = new Schema({
  generalDescription:String,
  telefon:[{
    nume:String,
    numar:String
  }]
});

module.exports=mongoose.model('myPrescription',myPrescriptionSchema,'myPrescription');
