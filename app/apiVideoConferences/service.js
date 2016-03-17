'use strict';

var Conference = require('../models/liveConferences');
var ConferenceMessages = require('../models/conferenceMessages');

var Utils = require('../modules/utils');

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

function getMessageHistory(userEmail, userId, conferenceId){
	var deferred = Q.defer();
	getConferenceRole(userEmail, conferenceId)
		.then(function(role){
			var query = {conferenceId: conferenceId};
			if(role === "viewer"){
				query.from = userId;
			}
			if(role === "speaker"){
				query.to = userId;
			}
			ConferenceMessages
				.find(query)
				.populate('to from')
				.sort({ timestamp: 1 })
				.exec(function(err, payload) {
					if(err){
						deferred.reject(err);
					}else{
						deferred.resolve(payload);
					}
				});
		})
		.catch(function(err){
			deferred.reject(err);
		})
	return deferred.promise;
}

function pushChatMessage(message){
	var deferred = Q.defer();

	var mess = new ConferenceMessages({
		conferenceId: message.conferenceId,
		to: message.to,
		from: message.from,
		text: message.text,
		timestamp: message.timestamp,
		fromSystem: message.fromSystem
	});

	mess.save(function(err, savedMessage) {
		if (err) {
		  	deferred.reject(err);
		}else{
		  	savedMessage.populate('to from', function(err, mess) {
		  		if(err){
		  			deferred.reject(err);
		  		}else{
		  			deferred.resolve(mess);
		  		}
		  	});
		}
	});

	return deferred.promise;
}

function kickUser(usernameRequestingKick, userIdToKick, conferenceId){
	var deferred = Q.defer();

	getConferenceRole(usernameRequestingKick, conferenceId)
		.then(function(role){
			if(role !== "moderator"){
				deferred.reject("Not allowed");
			}else if(!userIdToKick || !conferenceId){
				deferred.reject("Required query params: userId and conferenceId");
			}else{
				// mark all the user's messages in this conference until now as hidden
				ConferenceMessages.update(
					{ from: userIdToKick, conferenceId: conferenceId },
					{ $set: { hidden: '1' } },
					{ multi: true },
					function(err, response) {
						if (err) {
						  	deferred.reject(err);
						}else {
						  	deferred.resolve();
						}
					}
				);
			}
		})
		.catch(function(err){
			deferred.reject(err);
		});
}

module.exports = {
	getAttendingConferences: getAttendingConferences,
	getConferenceRole: getConferenceRole,
	getConference: getConference,
	getSpeakers: getSpeakers,
	getMessageHistory: getMessageHistory,
	pushChatMessage: pushChatMessage,
	kickUser: kickUser
};
