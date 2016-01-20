var ModelInfos = require('../../models/model_infos');

var async = require ('async');

var modelsToSeed = ["januvia_users","guideline"];

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

