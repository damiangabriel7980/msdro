'use strict';

var Conference = require('../../models/liveConferences');

var Utils = require('../../modules/utils');

var Q = require('q');

function getAttendingConferences(userEmail){
	var deferred = Q.defer();
	Conference.aggregate([
	    {$match: {$or: [
	                {"moderator.username": userEmail},
	                {"speakers.username": userEmail},
	                {"viewers.username": userEmail}
	        ]}}
	], function(err, result){
		if(err){
			deferred.reject(err);
		}else{
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function getConferenceRole(userEmail, conference_id){
	var deferred = Q.defer();
	Conference.aggregate([
	    {$match: {_id: Utils.mongoose.ObjectId(conference_id)}},
	    {$unwind: "$speakers"},
	    {$unwind: "$viewers"},
	    {$match: {$or: [
            {"moderator.username": userEmail},
            {"speakers.username": userEmail},
            {"viewers.username": userEmail}
	    ]}},
    	{$limit: 1}
	], function(err, result){
		if(err){
			deferred.reject(err);
		}else if(result.length !== 1){
			deferred.resolve(null);
		}else{
			var conference = result[0];
			if(conference.moderator && conference.moderator.username === userEmail){
				deferred.resolve("moderator");
			}else if(conference.speakers && conference.speakers.username === userEmail){
				deferred.resolve("speaker");
			}else if(conference.viewers && conference.viewers.username === userEmail){
				deferred.resolve("viewer");
			}else{
				deferred.resolve(null);
			}
		}
	});
	return deferred.promise;
}

function getConference(conferenceId){
	var deferred = Q.defer();
	Conference.findOne({_id: conferenceId}, function(err,res){
			if(err){
				deferred.reject(err);
			}else{
				deferred.resolve(res);
			}
		});
	return deferred.promise;
}

function getSpeakers(conferenceId) {
	console.log('ENTERED GET SPEAKERS:');
	var deferred = Q.defer();

	Conference.aggregate([
		{ $match: { _id: Utils.mongoose.ObjectId(conferenceId) } },
		{ $unwind: "$speakers" },
		{ $project: { _id: '$speakers._id', username: '$speakers.username', name: '$speakers.name' } }
	], function(err, res) {
		if (err) {
			deferred.reject(err);
		}
		else {
			console.log('SPEAKERS REGISTERED TO THIS CONFERENCE:');
			console.log(res);
			deferred.resolve(res);
		}
	});

	return deferred.promise;
}

module.exports = {
	getAttendingConferences: getAttendingConferences,
	getConferenceRole: getConferenceRole,
	getConference: getConference,
	getSpeakers: getSpeakers
};
