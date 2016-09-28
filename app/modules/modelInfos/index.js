var ModelInfos = require('../../models/model_infos');
var q = require('q');

/**
 * Change MongoDB model last updated info module.
 * @module modelDateUpdatedModule
 */

/**
 * Change the last updated date of a MongoDB model
 *
 * @function
 * @name recordLastUpdate
 * @param {String} modelName - The name of the MongoDB model
 * @example
 * var modelDateUpdated = require(/path/to/modelDateUpdated/module)
 * modelDateUpdated.recordLastUpdate("articles").then(
 *      function(success){
 *
 *      },
 *      function(error){
 *
 *      }
 * );
 */
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

/**
 * Retrieve the last updated date of a MongoDB model
 *
 * @function
 * @name getLastUpdate
 * @param {String} modelName - The name of the MongoDB model
 * @example
 * var modelDateUpdated = require(/path/to/modelDateUpdated/module)
 * modelDateUpdated.getLastUpdate("articles").then(
 *      function(success){
 *
 *      },
 *      function(error){
 *
 *      }
 * );
 */

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