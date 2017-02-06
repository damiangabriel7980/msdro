/**
 * Created by paulsuceveanu on 02/02/2017.
 */
'use strict';

var MailerModule = require('../mailer');
var UtilsModule = require('../utils');
var Q = require('q');
var registrationHelper = module.exports = {};
var Config = require('../../../config/environment');
var User = require('../../models/user');

registrationHelper.sendActivationCode = function (req) {
    var deferred = Q.defer();

        UtilsModule.generateToken(req.user.username, function (err, activationToken) {
            var activationLink = UtilsModule.activationPrefixStaywell(req.headers.host) + activationToken;
            var emailTo = [{email: req.user.username, name: req.user.name}];

            MailerModule.send(
                Config().createAccountTemplate,
                [
                    {
                        "name": "title",
                        "content": new User({title: req.user.title}).getEmailTitle()
                    },
                    {
                        "name": "name",
                        "content": req.user.name
                    },
                    {
                        "name": "activationLink",
                        "content": activationLink
                    }
                ],
                emailTo,
                'Activare cont MSD',
                {
                    "name": "activationLink",
                    "content": activationLink
                }
            ).then(function () {
                deferred.resolve();
            }, function (err) {
                deferred.reject(err);
            });
        });
    return deferred.promise;
};
