/**
 * Created by andrei on 11.12.2014.
 */

module.exports = function (socketServer, tokenSecret, logger) {

    var io = require('socket.io')(socketServer);
    var socketioJwt = require("socketio-jwt");
    var mongoose = require('mongoose');
    var async = require('async');

    // chat
    var Message = require('./models/chatMessages');

    // Q/A
    var Threads = require('./models/qa_threads');
    var qaMessages = require('./models/qa_messages');
    var Topics = require('./models/qa_topics');
    var AnswerGivers = require('./models/qa_answerGivers');

    //exclude users' personal info
    var userExcludes = '-state -subscription -account_expired -account_locked -enabled -last_updated -citiesID -conferencesID -jobsID -phone -points -proof_path -rolesID -show_welcome_screen -groupsID -resetPasswordToken -resetPasswordExpires -activationToken -conferencesID -password -password_expired';

    var getIds = function (arr, cb) {
        var ret = [];
        async.each(arr, function (item, callback) {
            ret.push(item._id);
            callback();
        }, function (err) {
            cb(ret);
        });
    };

    var getIdsMedics = function (arr, cb) {
        var ret = [];
        async.each(arr, function (item, callback) {
            ret.push(item.id_user);
            callback();
        }, function (err) {
            cb(ret);
        });
    };

    // set authorization for socket.io
    io.sockets
        .on('connection', socketioJwt.authorize({
            secret: tokenSecret,
            timeout: 15000 // 15 seconds to send the authentication message
        }))
        .on('authenticated', function(socket) {
            //this socket is authenticated, we are good to handle more events from it
            console.log("================================== socket authenticated");
            var userData = socket.decoded_token;
            console.log(userData.username);
            socket.emit('userAuthenticated', userData);
            socket
                .on('startThread', function (data) {
                    //only questioners can start a thread
                    if(!userData.answerer){
                        var text = data;
                        //parse text and get topics/medics
                        var topics = text.match(/(#[a-z0-9][a-z0-9\-_]*)/ig);
                        if(!topics) topics = [];
                        var medics = text.match(/(@[a-z0-9][a-z0-9\-_]*)/ig);
                        if(!medics) medics = [];
                        //remove #/@ from topics/medics
                        var cleanTopics = [];
                        var cleanMedics = [];
                        async.each(topics, function (topic, callback) {
                            cleanTopics.push(topic.replace('#',''));
                            callback();
                        }, function () {
                            async.each(medics, function (medic, callback) {
                                cleanMedics.push(medic.replace('@',''));
                                callback();
                            }, function(){
                                //remove topics and medics from text
                                text = text.replace(/(#[a-z0-9][a-z0-9\-_]*)/ig,'');
                                text = text.replace(/(@[a-z0-9][a-z0-9\-_]*)/ig,'');
                                text = text.trim();
                                //validate text
                                if(text.length < 10){
                                    socket.emit('feedbackMessage',{type: 'error', text: 'Question has to be at least 10 characters long'});
                                }else{
                                    var thread = new Threads({});
                                    thread.owner = userData._id;
                                    thread.ownerDisplay = userData.name;
                                    //find topics in db
                                    Topics.find({name: {$in: cleanTopics}}, function (err, topics) {
                                        if(err){
                                            logger.log(err);
                                            socket.emit('feedbackMessage',{type: 'error', text: 'Error processing topics'});
                                        }else{
                                            //check if all topics sent by user actually exist
                                            if(topics.length != cleanTopics.length && cleanTopics.length != 0){
                                                socket.emit('feedbackMessage',{type: 'error', text: 'Not all topics are valid'});
                                            }else{
                                                //get id's of topics
                                                getIds(topics, function (topicsIds) {
                                                    console.log(topics);
                                                    thread.topics = topicsIds;
                                                    //find medics aliases in db
                                                    AnswerGivers.find({nickname: {$in: cleanMedics}}, function (err, medics) {
                                                        if(err){
                                                            logger.log(err);
                                                            socket.emit('feedbackMessage',{type: 'error', text: 'Error processing medics'});
                                                        }else{
                                                            //check if all medics sent by user actually exist
                                                            if(medics.length != cleanMedics.length && cleanMedics.length != 0){
                                                                socket.emit('feedbackMessage',{type: 'error', text: 'Not all medics are valid'});
                                                            }else{
                                                                //get id's of medics
                                                                getIdsMedics(medics, function (medicsIds) {
                                                                    thread.medics = medicsIds;
                                                                    //thread is not grabbed by anyone yet and has no messages yet
                                                                    thread.locked = null;
                                                                    thread.messages = [];
                                                                    //add first question
                                                                    thread.question = text;
                                                                    thread.date_recorded = Date.now();
                                                                    //save thread
                                                                    thread.save(function (err, threadSaved) {
                                                                        if(err){
                                                                            console.log(err);
                                                                            socket.emit('feedbackMessage',{type: 'error', text: 'Error saving thread'});
                                                                        }else{
                                                                            socket.emit('feedbackMessage',{type: 'info', text: 'Thread saved!'});
                                                                            socket.broadcast.emit('threadAdded', threadSaved);
                                                                        }
                                                                    });
                                                                });
                                                            }
                                                        }
                                                    });
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        });
                    }else{
                        socket.emit('feedbackMessage',{type:'error', text: 'Not allowed to start thread'});
                    }
                })
                .on('loadThreads', function () {
                    if(!userData.answerer){
                        //user is a questioner; load threads with at least one answer
                        console.log("load'em threads");
                        Threads
                            .find({answered: {$exists: true, $ne: false}})
                            .populate('medics messages topics')
                            .exec(function (err, threads) {
                                if(err){
                                    socket.emit('feedbackMessage',{type:'error', text: 'Error loading threads'});
                                }else{
                                    socket.emit('threadsLoaded', threads);
                                }
                            });
                    }else{
                        //user is an answerer; load threads that are both:
                        // 1. addressed to this user or to nobody
                        // 2. locked by this user or by nobody
                        console.log("load'em threads");
                        Threads
                            .find({locked: {$in: [userData._id, null]}, $or: [{medics: {$in: [userData.alias.id_user]}}, {medics: {$size: 0}}]})
                            .populate('medics topics messages')
                            .exec(function (err, threads) {
                                if(err){
                                    console.log(err);
                                    socket.emit('feedbackMessage',{type:'error', text: 'Error loading threads'});
                                }else{
                                    socket.emit('threadsLoaded', threads);
                                }
                            });
                    }
                })
                .on('pickupThread', function (thread_id) {
                    //only answerers can pick up a thread
                    if(userData.answerer){
                        //check if thread is assigned to this medic or to nobody
                        Threads.findOne({_id: thread_id, medics: {$in: [userData.alias.id_user, null]}}, function (err, thread) {
                            if(err){
                                socket.emit('feedbackMessage',{type:'error', text: 'Unable to find thread'});
                            }else{
                                if(!thread){
                                    socket.emit('feedbackMessage',{type:'error', text: 'Not allowed to pick up this thread'});
                                }else{
                                    if(thread.locked){
                                        socket.emit('feedbackMessage',{type:'error', text: 'Thread already picked up'});
                                    }else{
                                        Threads.update({_id: thread._id}, {$set: {locked: userData._id}}, function (err) {
                                            if(err){
                                                socket.emit('feedbackMessage',{type:'error', text: 'Could not pick up thread'});
                                            }else{
                                                socket.emit('feedbackMessage',{type:'info', text: 'Thread picked up'});
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }else{
                        socket.emit('feedbackMessage',{type:'error', text: 'Not allowed to answer thread'});
                    }
                })
                .on('dropThread', function (thread_id) {
                    //only answerers can drop a thread
                    if(userData.answerer){
                        //get thread
                        Threads.findOne({_id: thread_id}, function (err, thread) {
                            if(err){
                                socket.emit('feedbackMessage',{type:'error', text: 'Unable to find thread'});
                            }else{
                                //check if thread was locked by this user
                                if(thread.locked != userData._id){
                                    socket.emit('feedbackMessage',{type:'error', text: "You cannot drop someone else's thread"});
                                }else{
                                    //drop thread
                                    Threads.update({_id: thread._id}, {$set: {locked: null}}, function (err) {
                                        if(err){
                                            socket.emit('feedbackMessage',{type:'error', text: 'Could not drop thread'});
                                        }else{
                                            socket.emit('feedbackMessage',{type:'info', text: 'Thread dropped'});
                                        }
                                    });
                                }
                            }
                        });
                    }else{
                        socket.emit('feedbackMessage',{type:'error', text: 'Permission denied'});
                    }
                })
                .on('answerThread', function (data) {
                    //check if user is answerer
                    if(userData.answerer){
                        //find thread
                        Threads.findOne({_id: data.thread_id}, function (err, thread) {
                            if(err){
                                socket.emit('feedbackMessage',{type:'error', text: 'Error finding thread'});
                            }else{
                                if(!thread){
                                    socket.emit('feedbackMessage',{type:'error', text: 'Thread not found'});
                                }else{
                                    //check if this user locked the thread
                                    if(thread.locked == userData._id){
                                        //validate answer length
                                        if(data.text.length < 10){
                                            socket.emit('feedbackMessage',{type:'error', text: 'Answer needs to be at least 10 characters long'});
                                        }else{
                                            //record answer
                                            var answer = new qaMessages({
                                                text: data.text,
                                                type: 2,
                                                date_recorded: Date.now(),
                                                owner: userData._id,
                                                ownerDisplay: userData.alias.nickname
                                            });
                                            answer.save(function (err, savedAns) {
                                                if(err){
                                                    socket.emit('feedbackMessage',{type:'error', text: 'Error saving answer'});
                                                }else{
                                                    //tie thread to answer and mark thread as answered
                                                    Threads.update({_id: thread._id}, {$addToSet: {messages: savedAns._id}, $set: {answered: true}}, function (err, wRes) {
                                                        if(err){
                                                            logger.error(err);
                                                            socket.emit('feedbackMessage',{type:'error', text: 'Error saving answer'});
                                                        }else{
                                                            if(wRes == 0){
                                                                socket.emit('feedbackMessage',{type:'error', text: 'Error saving answer'});
                                                            }else{
                                                                socket.emit('feedbackMessage',{type:'success', text: 'Answer saved'});
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }else{
                                        if(thread.locked){
                                            socket.emit('feedbackMessage',{type:'error', text: 'Thread was already picked up by someone else'});
                                        }else{
                                            socket.emit('feedbackMessage',{type:'error', text: 'Thread was not picked up'});
                                        }
                                    }
                                }
                            }
                        });
                    }else{
                        socket.emit('feedbackMessage',{type:'error', text: 'Permission denied'});
                    }
                })
                .on('followupQuestion', function (data) {
                    //check if user is questioner
                    if(userData.answerer){
                        socket.emit('feedbackMessage',{type:'error', text: 'Not allowed to start thread'});
                    }else{
                        //get thread
                        Threads.findOne({_id: data.thread_id}, function (err, thread) {
                            if(err){
                                logger.error(err);
                                socket.emit('feedbackMessage',{type:'error', text: 'Error finding thread'});
                            }else{
                                if(!thread){
                                    socket.emit('feedbackMessage',{type:'error', text: 'Thread not found'});
                                }else{
                                    //check if user started the thread
                                    if(thread.owner != userData._id){
                                        socket.emit('feedbackMessage',{type:'error', text: 'You can only place a follow-up question on threads started by you'});
                                    }else{
                                        //validate question text
                                        if(data.text.length < 10){
                                            socket.emit('feedbackMessage',{type:'error', text: 'Question needs to be at least 10 characters long'});
                                        }else{
                                            //save question
                                            var qestion = new qaMessages({
                                                text:data.text,
                                                type: 1,
                                                date_recorded: Date.now(),
                                                owner: userData._id,
                                                ownerDisplay: userData.name
                                            });
                                            qestion.save(function (err, saved) {
                                                if(err){
                                                    socket.emit('feedbackMessage',{type:'error', text: 'Error saving question'});
                                                }else{
                                                    // tie question to thread
                                                    Threads.update({_id: thread._id}, {$addToSet: {messages: saved._id}}, function (err, wRes) {
                                                        if(err){
                                                            socket.emit('feedbackMessage',{type:'error', text: 'Error saving question'});
                                                        }else if(wRes == 0){
                                                            socket.emit('feedbackMessage',{type:'error', text: 'Error saving question'});
                                                        }else{
                                                            socket.emit('feedbackMessage',{type:'success', text: 'Question saved'});
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        });
                    }
                })
                .on('disconnect', function () {
                    console.log("================================== socket disconnected");
                });
        });
};