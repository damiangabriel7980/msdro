var ModelInfos = require('../../models/model_infos');
var q = require('q');

exports.recordLastUpdate = function (modelName) {
	var deferred = q.defer();
	ModelInfos.update({model_name: modelName}, {$set: {last_update: new Date()}}, function (err, wres) {
		if(err)
			deferred.reject(err);
		else
			deferred.resolve(wres);
	});
	return deferred.promise;
};

exports.getLastUpdate = function (modelName) {
	var deferred = q.defer();
	ModelInfos.findOne({model_name: modelName}, function (err, info) {
		if(err){
			deferred.reject(err);
		}else if(!info){
			deferred.reject("No info for this model");
		}else{
			deferred.resolve(info.last_update);
		}
	});
	return deferred.promise;
};