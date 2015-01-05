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

    var getIds = function (arr, cb) {
        var ret = [];
        async.each(arr, function (item, callback) {
            ret.push(item._id);
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
            socket.emit('userAuthenticated', userData);
            console.log(userData._id);
            console.log(userData.username);
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
                                                    //find medics in db
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
                                                                getIds(medics, function (medicsIds) {
                                                                    thread.medics = medicsIds;
                                                                    //thread is not grabbed by anyone yet and has no messages yet
                                                                    thread.locked = null;
                                                                    thread.messages = [];
                                                                    //add first question
                                                                    thread.question = text;
                                                                    thread.date_recorded = Date.now();
                                                                    //save thread
                                                                    console.log(thread);
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
                        Threads.find({answers: {$exists: true, $not: {$size: 0}}}, function (err, threads) {
                            if(err){
                                socket.emit('feedbackMessage',{type:'error', text: 'Error loading threads'});
                            }else{
                                socket.emit('threadsLoaded', threads);
                            }
                        });
                    }else{
                        //user is an answerer; load threads that are addressed to him or to nobody
                        Threads.find({owner: {$in: [userData._id, null]}}, function (err, threads) {
                            if(err){
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
                        //check if thread is not already picked up
                        Threads.find({_id: thread_id}, function (err, thread) {
                            if(err){
                                socket.emit('feedbackMessage',{type:'error', text: 'Unable to find thread'});
                            }else{
                                if(thread.locked){
                                    socket.emit('feedbackMessage',{type:'error', text: 'Thread already picked up'});
                                }else{
                                    thread.locked = userData._id;
                                    thread.save(function (err) {
                                        if(err){
                                            socket.emit('feedbackMessage',{type:'error', text: 'Could not pick up thread'});
                                        }else{
                                            socket.emit('feedbackMessage',{type:'info', text: 'Thread picked up'});
                                        }
                                    });
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
                        Threads.find({_id: thread_id}, function (err, thread) {
                            if(err){
                                socket.emit('feedbackMessage',{type:'error', text: 'Unable to find thread'});
                            }else{
                                //check if thread is started by this user
                                if(thread.locked != userData._id){
                                    socket.emit('feedbackMessage',{type:'error', text: "You cannot drop someone else's thread"});
                                }else{
                                    //check if thread has answers
                                    qaMessages.find({_id: {$in: thread.messages}, owner: userData._id}, function (err, messages) {
                                        if(err){
                                            socket.emit('feedbackMessage',{type:'error', text: 'Error processing request'});
                                        }else{
                                            if(messages.length != 0){
                                                socket.emit('feedbackMessage',{type:'error', text: "You cannot drop a thread once you've given answers"});
                                            }else{
                                                //drop thread
                                                thread.locked = null;
                                                thread.save(function (err) {
                                                    if(err){
                                                        socket.emit('feedbackMessage',{type:'error', text: 'Could not drop thread'});
                                                    }else{
                                                        socket.emit('feedbackMessage',{type:'info', text: 'Thread dropped'});
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }else{
                        socket.emit('feedbackMessage',{type:'error', text: 'Permission denied'});
                    }
                })
                .on('addQuestionToThread', function (data) {
                    
                })
//                .on('chatMessage', function (data) {
//                    var message = data.message;
//                    var room = data.room;
//                    //TODO: check room exists
//                    if(!message || !room){
//                        //something's wrong
//                        socket.emit('feedbackMessage', {accepted: false, recorded: false, message:'No room/message present'});
//                    }else{
//                        //add to db
//                        data.room = "test";
//                        data.date_written = Date.now();
//                        var toAdd = new Message(data);
//                        toAdd.save(function (err, saved) {
//                            if(err){
//                                socket.emit('feedbackMessage', {accepted: true, recorded: false, message:'Unable to record message'});
//                            }else{
//                                socket.emit('feedbackMessage', {accepted: true, recorded: true, message:saved});
//                            }
//                        });
//                    }
//                    console.log(userData.username+": "+data);
//                })
                .on('disconnect', function () {
                    console.log("================================== socket disconnected");
                });
        });
};