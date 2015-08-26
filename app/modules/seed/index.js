var ModelInfos = require('../../models/model_infos');

ModelInfos.findOne({}, function (err, mi) {
    if(err){
        console.log(err);
    }else if(!mi){
        ModelInfos.create({
            model_name: "januvia_users",
            last_update: Date.now()
        }, function (err) {
            if(err){
                console.log(err);
            }else{
                console.log("Finished seeding model infos");
            }
        });
    }
});