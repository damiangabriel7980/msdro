/**
 * Created by andrei on 11.12.2014.
 */

module.exports = function (socketServer, tokenSecret) {

    var io = require('socket.io')(socketServer);
    var socketioJwt = require("socketio-jwt");
    var mongoose = require('mongoose');

    var Message = require('./models/chatMessages');

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
            socket
                .on('question', function (data) {
                    
                })
                .on('chatMessage', function (data) {
                    var message = data.message;
                    var room = data.room;
                    //TODO: check room exists
                    if(!message || !room){
                        //something's wrong
                        socket.emit('feedbackMessage', {accepted: false, recorded: false, message:'No room/message present'});
                    }else{
                        //add to db
                        data.room = "test";
                        data.date_written = Date.now();
                        var toAdd = new Message(data);
                        toAdd.save(function (err, saved) {
                            if(err){
                                socket.emit('feedbackMessage', {accepted: true, recorded: false, message:'Unable to record message'});
                            }else{
                                socket.emit('feedbackMessage', {accepted: true, recorded: true, message:saved});
                            }
                        });
                    }
                    console.log(userData.username+": "+data);
                })
                .on('disconnect', function () {
                    console.log("================================== socket disconnected");
                });
        });
};