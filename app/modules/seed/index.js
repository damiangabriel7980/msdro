var ModelInfos = require('../../models/model_infos');
var myPrescription = require('../../models/myPrescription');

var async = require ('async');

var modelsToSeed = ["januvia_users","guideline","myPrescription"];

async.each(modelsToSeed, function(model, callback){
    ModelInfos.findOne({model_name: model}, function (err, mi) {
        if(err){
            console.log(err);
        }else if(!mi){
            ModelInfos.create({
                model_name: model,
                last_update: Date.now()
            }, function (err) {
                if(err){
                    callback(err);
                }else{
                    callback();
                }
            });
        }
    });
},function(){
    console.log("Finished seeding model infos");
});

myPrescription.find({},function(err,resp){
  if(err){
    return console.log(err);
  }else if(resp.length == 0){
    myPrescription.create({
      generalDescription:'',
      telefon:[{
        name:'',
        number:''
      }],
      termsOfUseUrl:'',
      privacyPolicyUrl:''
    })
  }
})
