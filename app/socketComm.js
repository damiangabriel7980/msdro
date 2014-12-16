/**
 * Created by andrei on 11.12.2014.
 */

module.exports = function (socketServer) {

    var io = require('socket.io')(socketServer);

    io.on('connection', function(socket){
        console.log("================================== socket connected");
        socket.on('chat message', function(data){
            console.log("================================== socket event");
            console.log(data);
        });
        socket.on('disconnect', function(){
            console.log("================================== socket disconnected");
        });
    });

};