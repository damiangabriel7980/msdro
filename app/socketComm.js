/**
 * Created by andrei on 11.12.2014.
 */

module.exports = function (socketServer, logger) {

    var io = require('socket.io')(socketServer);

    io.on('connection', function(socket){
        logger.info("================================== socket connected");
        socket.on('chat message', function(data){
            logger.info("================================== socket event");
            logger.info(data);
        });
        socket.on('disconnect', function(){
            logger.info("================================== socket disconnected");
        });
    });

};