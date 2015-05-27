var Config = require('../../../config/environment.js'),
    my_config = new Config();

var mandrill = require('node-mandrill')(my_config.mandrillKey);

var Q = require('q');

var Parameters = require('../../models/parameters');

exports.send = function (template_name, template_content, to, subject) {
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
                    subject: subject
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