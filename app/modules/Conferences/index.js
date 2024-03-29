/**
 * Created by user on 05.08.2015.
 */

var Conferences = require('../../models/conferences');
var User = require('../../models/user');
var async = require('async');
var Talks = require('../../models/talks');
var Speakers = require('../../models/speakers');


var getTalksByConference = function (conference_id, callback) {
    Talks.find({conference: conference_id}).sort({hour_start: 1}).populate('room speakers').exec(function (err, talks) {
        if(err){
            callback(err, null);
        }else{
            callback(null, talks);
        }
    });
};

var getSpeakersForConferences = function(conferences_ids,callback){

    Talks.distinct('_id',{conference:{$in:conferences_ids || []}},function(err, talksId){
        if(err){
           callback(err);
        }
        else{
            Talks.distinct('speakers',{_id:{$in:talksId}},function(err, speakerId) {
                if (err) {
                    callback(err);
                }
                else {
                    Speakers.find({'_id': {$in: speakerId}}, function (err, result) {
                        if (err) {
                            callback(err);
                        }
                        else {
                           // queryResult.speakers = result;
                            callback(null , result);
                        }
                    });
                }
            })
        }
    })
};

var getTalksByRoom = function (room_id, callback) {
    Talks.find({room: room_id}).sort({hour_start: 1}).populate('room speakers').exec(function (err, talks) {
        if(err){
            callback(err, null);
        }else{
            callback(null, talks);
        }
    });
};

var getConferencesInDepth = function(conferences_ids, callback){
    var resp = [];
    Conferences.find({_id: {$in: conferences_ids}}, function (err, conferences) {
        if(err){
            callback(err, null);
        }else{
            if(conferences.length != 0){
                //get all talks for each conference async
                async.each(conferences, function (conference, cb) {
                    var conf = conference.toObject();
                    getTalksByConference(conference._id, function (err, talks) {
                        if(err){
                            cb(err);
                        }else{
                            conf.talks = talks;
                            resp.push(conf);
                            cb();
                        }
                    });
                }, function (err) {
                    if(err){
                        callback(err, null);
                    }else{
                        callback(null, resp);
                    }
                });
            }else{
                callback(null, conferences);
            }
        }
    });
}

var getConferencesForUser = function (id_user, callback) {
    User.findOne({_id: id_user}, function (err, user) {
        if(err){
            callback(err, null);
        }else{
            //get all conferences for this user
            getConferencesInDepth(user.conferencesID,callback);

        }
    });
};

var getConference = function (id_conference, callback) {
    Conferences.findOne({_id: id_conference}, function (err, conference) {
        if(err){
            callback(err, null);
        }else{
            if(!conference){
                callback({hasError: true, message: "Conference not found"});
            }else{
                var ret = conference.toObject();
                getTalksByConference(conference._id, function (err, talks) {
                    if(err){
                        callback(err, null);
                    }else{
                        ret.talks = talks;
                        callback(null, ret);
                    }
                });
            }
        }
    });
};

var addConferenceToUser = function (id_conference, id_user, callback) {
    User.update({_id: id_user}, {$addToSet: {conferencesID: id_conference}}, {multi: false}, function (err, res) {
        callback(err, res);
    });
};
module.exports={
    getConferencesForUser:getConferencesForUser,
    getConference:getConference,
    addConferenceToUser:addConferenceToUser,
    getConferencesInDepth:getConferencesInDepth,
    getSpeakersForConferences:getSpeakersForConferences
}