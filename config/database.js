var mongoose = require('mongoose');

module.exports = function (my_config, logger) {

    var connect = function () {
        logger.warn("Connecting to mongoose...");
        mongoose.connect(my_config.database); // connect to our database
    };
    connect();

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', function () {
        logger.warn('Mongoose connected');
    });

    // If the connection throws an error
    mongoose.connection.on('error',function (err) {
        logger.warn('Mongoose default connection error:');
        logger.warn(err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        logger.warn('Mongoose default connection disconnected');
    });

};