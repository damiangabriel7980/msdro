var Config = require('../../../config/environment.js'),
    my_config = new Config();

var mandrill = require('node-mandrill')(my_config.mandrillKey);

var Q = require('q');

exports.send = function (template_name, template_content, to, subject) {
    var deferred = Q.defer();
    mandrill('/messages/send-template', {
        "template_name": template_name,
        "template_content": template_content,
        "message": {
            from_email: 'adminMSD@qualitance.ro',
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
    return deferred.promise;
};