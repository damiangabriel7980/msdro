var Config = require('../../../config/environment.js'),
    my_config = new Config();

var mandrill = require('node-mandrill')(my_config.mandrillKey);

var Q = require('q');

var Parameters = require('../../models/parameters');

exports.send = function (template_name, template_content, to, subject, activationURL) {
    var deferred = Q.defer();
    //get from_email from system parameters
    Parameters.findOne({name: "FROM_EMAIL"}, function (err, param) {
        if(err){
            deferred.reject(err);
        }else{
            //send email
            mandrill('/messages/send-template', {
                "template_name": template_name,
                "template_content": template_content,
                "message": {
                    from_email: param.value || param.default_value,
                    to: to,
                    subject: subject,
                    "global_merge_vars": activationURL ? [{
                        "name": "activationLink",
                        "content": activationURL
                    }] : []
                }
            }, function(err){
                if(err){
                    console.log(err);
                    deferred.reject("Eroare la trimitere email");
                }else{
                    deferred.resolve();
                }
            });
        }
    });
    return deferred.promise;
};

exports.sendNotification = function (template_name, template_content, to, subject,changesNotification,confDate,confHour,confName,userStatus,spkString,conferencesLink,mergeVars) {
    var deferred = Q.defer();
    //get from_email from system parameters
    Parameters.findOne({name: "FROM_EMAIL"}, function (err, param) {
        if(err){
            deferred.reject(err);
        }else{
                mandrill('/messages/send-template', {
                    "template_name": template_name,
                    "template_content": template_content,
                    "message": {
                        from_email: param.value || param.default_value,
                        to: to,
                        subject: subject,
                        "global_merge_vars": [
                            {
                                "name": "confDate",
                                "content": confDate
                            },
                            {
                                "name": "confHour",
                                "content": confHour
                            },
                            {
                                "name": "confName",
                                "content": confName
                            },
                            {
                                "name": "userStatus",
                                "content": userStatus
                            },
                            {
                                "name": "spkString",
                                "content": spkString
                            },
                            {
                                "name": "conferencesLink",
                                "content": conferencesLink
                            },
                            {
                                "name": "changesNotification",
                                "content": changesNotification
                            }
                        ],
                        "merge_vars": mergeVars
                    }
                }, function(err){
                    if(err){
                        deferred.reject("Eroare la trimitere email");
                    }else{
                        deferred.resolve();
                    }
                })
        }
    });
    return deferred.promise;
};