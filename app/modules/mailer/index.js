var Config = require('../../../config/environment.js'),
    my_config = new Config();
/**
 * Send emails via Mandrill API
 * @module mailerModule
 */

var mandrill = require('node-mandrill')(my_config.mandrillKey);

var Q = require('q');

var Parameters = require('../../models/parameters');

/**
 * Send email via mandrill API
 *
 * @function
 * @name send
 * @param {String} template_name - The name of the Mandrill template
 * @param {Array} template_content - an array of objects which contain custom fields to be filled (ex. : {name: 'varName', content: 'someContent'})
 * @param {String} to - The recipient email address
 * @param {String} subject - The subject of the email
 * @example
 * var mailerModule = require(/path/to/mailer/module)
 * mailerModule.send("tempName", [{name: 'varName', content: 'someContent'}], 'john@test.com', 'A subject').then(
 *      function(success){
 *
 *      },
 *      function(error){
 *
 *      }
 * );
 */
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

/**
 * Send email via mandrill API (used for MSD Conferences which is no longer active)
 *
 * @function
 * @name sendNotification
 * @param {String} template_name - The name of the Mandrill template
 * @param {Array} template_content - an array of objects which contain custom fields to be filled (ex. : {name: 'varName', content: 'someContent'})
 * @param {String} to - The recipient email address
 * @param {String} subject - The subject of the email
 * @param {Boolean} changesNotification - If true, a message regarding changes of a conference will be sent. Otherwise, an invitation to a conference email will be sent
 * @param {String} confDate - The date of the conference
 * @param {String} confHour - The hour of the conference
 * @param {String} confName - The name of the conference
 * @param {String} userStatus - The status of the user that receives the email
 * @param {String} spkString - A string containing a list of speakers that attend the conference
 * @param {String} conferencesLink - A link to the conference
 * @param {Array} mergeVars - Other Mandrill API custom variables to send (ex. [
 {
     "rcpt": "emailadress@domain.com",
     "vars": [
         {
             "name": "fname",
             "content": "John"
         },
         {
             "name": "lname",
             "content": "Smith"
         }
     ]
 }
 ])
 * @example
 * var mailerModule = require(/path/to/mailer/module)
 * mailerModule.sendNotification("tempName", [{name: 'varName', content: 'someContent'}], 'john@test.com', 'A subject', true, '20/02/2017', '09:00', 'A conference', '', 'x, y, z', 'https://somelink.com', ).then(
 *      function(success){
 *
 *      },
 *      function(error){
 *
 *      }
 * );
 */
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