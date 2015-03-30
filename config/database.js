var mongoose = require('mongoose');

module.exports = function (my_config) {

    var connect = function () {
        console.log("Connecting to mongoose...");
        mongoose.connect(my_config.database); // connect to our database
    };
    connect();

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', function () {
        console.log('Mongoose connected');
    });

    // If the connection throws an error
    mongoose.connection.on('error',function (err) {
        console.log('Mongoose default connection error: ' + err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
        setTimeout(function(){
            connect();
        }, 3000);
    });

};