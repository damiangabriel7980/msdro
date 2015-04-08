var Config = require('../config/environment.js'),
    my_config = new Config();

var AWS = require('aws-sdk');

module.exports = function(){
    //form sts object from environment variables. Used for retrieving temporary credentials to front end
    var sts = new AWS.STS();
    //configure credentials for use on server only; assign credentials based on role (never use master credentials)
    AWS.config.credentials = new AWS.EnvironmentCredentials('AWS');
    AWS.config.credentials = new AWS.TemporaryCredentials({
        RoleArn: 'arn:aws:iam::578381890239:role/msdAdmin'
    });
    //s3 object for use on server
    var s3 = new AWS.S3();
    //bucket retrieved from environment variables
    var amazonBucket = my_config.amazonBucket;

    //================================================================================================= amazon s3 functions
    // Used for retrieving temporary credentials to front end
    var getS3Credentials = function(RoleSessionName, callback){
        sts.assumeRole({
            RoleArn: 'arn:aws:iam::578381890239:role/msdAdmin',
            RoleSessionName: RoleSessionName,
            DurationSeconds: 900
        }, function (err, data) {
            if(err){
                callback(err, null);
            }else{
                callback(null, data);
            }
        });
    };

    //function for deleting object from amazon
    var deleteObjectS3 = function (key, callback) {
        s3.deleteObject({Bucket: amazonBucket, Key: key}, function (err, data) {
            callback(err, data);
        });
    };

    var addObjectS3 = function(key,body,callback){
        var bodyNew = new Buffer(body,'base64');
        s3.upload({Bucket: amazonBucket,Key: key, Body:bodyNew, ACL:'public-read'}, function (err, data2) {
            callback(err, data2);
        });

    };

    return {
        getS3Credentials: getS3Credentials,
        deleteObjectS3: deleteObjectS3,
        addObjectS3: addObjectS3
    };

};