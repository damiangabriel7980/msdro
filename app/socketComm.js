/**
 * Created by andrei on 11.12.2014.
 */

module.exports = function (socketServer, tokenSecret) {

    var io = require('socket.io')(socketServer);
    var socketioJwt = require("socketio-jwt");

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
                .on('chat message', function (data) {
                    console.log(userData.username+": "+data);
                })
                .on('disconnect', function () {
                    console.log("================================== socket disconnected");
                });
        });
};