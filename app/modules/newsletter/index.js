var async = require('async');
var Q = require('q');

var UtilsModule = require('../../modules/utils');

var Newsletter = {
    distributionLists: require('../../models/newsletter/distribution_lists'),
    campaigns: require('../../models/newsletter/campaigns'),
    templates: require('../../models/newsletter/templates'),
    unsubscribers: require('../../models/newsletter/unsubscribers')
};

var Users = require('../../models/user');
var Parameters = require('../../models/parameters');

module.exports = function (env, logger) {

    var mandrill = require('node-mandrill')(env.mandrillKey);
    var systemVariables = ["UNSUBSCRIBE_URL"];
    var variableTypes = ["text", "html"];

    function sendDueCampaigns() {
        Newsletter.campaigns.distinct("_id", {send_date: {$exists: true, $lt: Date.now()}, status: "not sent"}, function (err, campaigns_ids) {
            if(err){
                logger.error(err);
            }else{
                async.eachSeries(campaigns_ids, function (campaign_id, callback) {
                    sendCampaign(campaign_id).then(
                        function () {
                            Newsletter.campaigns.update({_id: campaign_id}, {$set: {status: "sent"}}, function () {
                                callback();
                            });
                        },
                        function (err) {
                            Newsletter.campaigns.update({_id: campaign_id}, {$set: {status: "error"}}, function () {
                                callback(err);
                            });
                        }
                    )
                }, function (err) {
                    if(err){
                        logger.error(err);
                    }else{
                        logger.warn("Finished job - due campaigns");
                    }
                })
            }
        });
    }

    function sendCampaign(campaign_id) {
        var deferred = Q.defer();
        Newsletter.campaigns.findOne({_id: campaign_id}).populate("templates.id").exec(function (err, campaign) {
            if(err){
                deferred.reject(err);
            }else if(!campaign){
                deferred.reject("Campaign not found");
            }else{
                //first, create a subaccount for this campaign
                generateSubaccount(campaign_id).then(
                    function (subaccountId) {
                        Q.all([
                            getEmails(campaign.distribution_lists),
                            populateTemplates(campaign.templates)
                        ]).then(
                            function (results) {
                                var users = results[0];
                                var html = results[1];
                                sendEmailInBatches(subaccountId, campaign.subject, html, users, env.newsletter.batch.size, env.newsletter.batch.secondsBetween).then(
                                    function (batchesCount) {
                                        logger.warn("Sent "+batchesCount+" batches of maximum "+env.newsletter.batch.size+" emails");
                                        deferred.resolve();
                                    },
                                    function (err) {
                                        deferred.reject(err);
                                    }
                                );
                            },
                            function (err) {
                                deferred.reject(err);
                            }
                        );
                    },
                    function (err) {
                        deferred.reject(err);
                    }
                );
            }
        });
        return deferred.promise;
    }

    function generateSubaccountId(campaign_id){
        return "msd_newsletter_" + process.env.NODE_ENV + "_" + campaign_id;
    }

    function getCampaignTag(){
        return "msd_" + process.env.NODE_ENV + "_campaign_mail";
    }

    function generateSubaccount(campaign_id){
        var deferred = Q.defer();
        var subaccountId = generateSubaccountId(campaign_id);
        mandrill('/subaccounts/add', {
            "id": subaccountId,
            "name": subaccountId
        }, function(err, resp){
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(subaccountId);
            }
        });
        return deferred.promise;
    }

    function getEmails(distributionListsIds){
        var deferred = Q.defer();
        Q.all([
            getEmailsFromCustomLists(distributionListsIds),
            getEmailsFromGroups(distributionListsIds)
        ]).then(
            function (results) {
                deferred.resolve(concatEmailsUnique(results[0], results[1]));
            },
            function (err) {
                deferred.reject(err);
            }
        );
        return deferred.promise;
    }

    function getEmailsFromGroups(distributionListsIds) {
        var deferred = Q.defer();
        Newsletter.distributionLists.distinct("user_groups", {_id: {$in: distributionListsIds}}, function (err, groupsIds) {
            if(err){
                deferred.reject(err);
            }else{
                Users.aggregate([
                    { $match: {groupsID: {$in: groupsIds}, "subscriptions.newsletterStaywell": {$ne: false}} },
                    { $project: {_id:0, email: "$username", name: "$name"} }
                ], function (err, users) {
                    if(err){
                        deferred.reject(err);
                    }else{
                        deferred.resolve(users);
                    }
                });
            }
        });
        return deferred.promise;
    }

    function getEmailsFromCustomLists(distributionListsIds) {
        var deferred = Q.defer();
        //get unsubscribers emails lowercased
        Newsletter.unsubscribers.aggregate([
            {$project: {"email": {$toLower: "$email"}}},
            {$group: {_id: null, emails: {$addToSet: "$email"}}}
        ], function (err, result) {
            if(err){
                deferred.reject(err);
            }else{
                var unsubscribedEmails = (result && result[0] && result[0].emails)?result[0].emails:[];
                Newsletter.distributionLists.aggregate([
                    { $match: {_id: {$in: distributionListsIds}} },
                    { $unwind: "$emails"},
                    { $group: {_id: "$emails.email", email: {$first: "$emails.email"}, name: {$first: "$emails.name"}} },
                    { $project: {_id: 0, email: {$toLower: "$email"}, name: 1} },
                    { $match: {email: {$nin: unsubscribedEmails}} }
                ], function (err, customEmails) {
                    if(err){
                        deferred.reject(err);
                    }else{
                        deferred.resolve(customEmails);
                    }
                });
            }
        });
        return deferred.promise;
    }

    function concatEmailsUnique(array1, array2){
        var result = array1;
        var exists;
        for(var i=0; i<array2.length; i++){
            exists = false;
            for(var j=0; j<array1.length && !exists; j++){
                if(array2[i].email === array1[j].email) exists = true;
            }
            if(!exists) result.push(array2[i]);
        }
        return result;
    }

    function populateTemplates(templates){
        var deferred = Q.defer();
        //console.log(templates);
        var populated = {};
        async.each(templates, function (template, callback) {
            try{
                if(template && template.id) populated[template.order] = populateTemplate(template.id.html, template.variables);
                callback();
            }catch(ex){
                callback(ex);
            }
        }, function (err) {
            if(err){
                deferred.reject(err);
            }else{
                var html = "";
                for(var key in populated){
                    if(populated.hasOwnProperty(key)){
                        html += populated[key];
                    }
                }
                deferred.resolve(html);
            }
        });
        return deferred.promise;
    }

    function populateTemplate(templateHtml, variables){
        templateHtml = templateHtml || "";
        for(var i=0; i<variables.length; i++){
            if(variables[i] && variableTypes.indexOf(variables[i].type) > -1 && variables[i].value){
                templateHtml = templateHtml.replace(new RegExp("\\*\\|"+variables[i].name+"\\|\\*", "g"), variables[i].value);
            }
        }
        return templateHtml;
    }

    function sendEmailInBatches(subaccountId, subject, html, users, batchSize, secondsBetween){
        var deferred = Q.defer();
        Parameters.findOne({name: "FROM_EMAIL"}, function (err, from_email) {
            if(err){
                deferred.reject(err);
            }else if(!from_email){
                deferred.reject("Cannot find system parameter FROM_EMAIL");
            }else{
                from_email = from_email.value || from_email.default_value;
                //split emails into batches
                var batches = splitArrayIntoChunks(users, batchSize);
                //send batches
                async.eachSeries(batches, function (batch, callback) {
                    logger.warn("Sending batch...");
                    sendBatch(subaccountId, subject, html, batch, from_email).then(
                        function () {
                            logger.warn("Sent batch of " + batch.length + " emails");
                            //wait a while before sending the next one
                            setTimeout(callback, secondsBetween * 1000);
                        },
                        function (err) {
                            callback(err);
                        }
                    );
                }, function (err) {
                    if(err){
                        deferred.reject(err);
                    }else{
                        deferred.resolve(batches.length);
                    }
                });
            }
        });
        return deferred.promise;
    }

    function splitArrayIntoChunks(toSplit, chunkSize){
        var ret = [];
        var length = toSplit.length;
        for (var i=0; i<length; i+=chunkSize) {
            ret.push(toSplit.slice(i,i+chunkSize));
        }
        return ret;
    }

    function hashUserMail(email) {
        return new Buffer(email).toString('base64');
    }

    function unhashUserMail(hasedEmail) {
        return new Buffer(hasedEmail, 'base64').toString('ascii');
    }

    function getUnsubscribeUrl(email) {
        var deferred = Q.defer();
        try{
            deferred.resolve(env.newsletter.unsubcribe + "?user=" +hashUserMail(email));
        }catch(ex){
            deferred.reject(ex);
        }
        return deferred.promise;
    }

    function getMergeVars(users){
        var deferred = Q.defer();
        var mergeVars = [];
        async.each(users, function (user, callback) {
            Q.all([
                getUnsubscribeUrl(user.email)
            ]).then(
                function (results) {
                    var unsubscribeUrl = results[0];
                    mergeVars.push({
                        "rcpt": user.email,
                        "vars": [{
                            "name": "UNSUBSCRIBE_URL",
                            "content": unsubscribeUrl
                        }]
                    });
                    callback();
                },
                function (err) {
                    callback(err);
                }
            );
        }, function (err) {
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(mergeVars);
            }
        });
        return deferred.promise;
    }

    function sendBatch(subaccountId, subject, html, users, from_email) {
        var deferred = Q.defer();
        getMergeVars(users).then(
            function (mergeVars) {
                //console.log(users);
                //console.log(mergeVars);
                mandrill('/messages/send', {
                    "message": {
                        "html": html,
                        "subject": subject,
                        "from_email": from_email,
                        "to": users,
                        "subaccount": subaccountId,
                        "tags": [getCampaignTag()],
                        "merge_vars": mergeVars
                    }
                }, function(err, resp){
                    if(err){
                        deferred.reject(err);
                    }else{
                        deferred.resolve(resp);
                    }
                });
            },
            function (err) {
                deferred.reject(err);
            }
        );
        return deferred.promise;
    }

    function getOverallStats() {
        var deferred = Q.defer();
        //console.log(users);
        mandrill('/tags/info', {
            "tag": getCampaignTag()
        }, function(err, resp){
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(resp);
            }
        });
        return deferred.promise;
    }

    function getCampaignStats(campaign_id) {
        var deferred = Q.defer();
        //console.log(users);
        mandrill('/subaccounts/info', {
            "id": generateSubaccountId(campaign_id)
        }, function(err, resp){
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(resp);
            }
        });
        return deferred.promise;
    }

    function recordStats(){
        Newsletter.campaigns.distinct("_id", {
            status: "sent",
            send_date: {$exists: true, $lt: UtilsModule.addDaysToDate(new Date(), (-1)*env.newsletter.statistics.scheduleLockDays)},
            "statistics.recorded": {$ne: true}
        }, function (err, campaign_ids) {
            if(err){
                console.log(err);
            }else if(!campaign_ids){
                console.log("No campaigns sent "+env.newsletter.statistics.scheduleLockDays+" days ago were found");
            }else{
                async.each(campaign_ids, recordCampaignStats, function (err) {
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Finished task - campaigns stats");
                    }
                });
            }
        })
    }

    function recordCampaignStats(campaign_id, callback){
        Newsletter.campaigns.findOne({_id: campaign_id}, function (err, campaign) {
            if(err){
                callback(err);
            }else{
                getCampaignStats(campaign_id).then(
                    function (resp) {
                        if(!resp || !resp.last_30_days){
                            callback("Invalid mandrill response");
                        }else{
                            var statistics = resp.last_30_days;
                            statistics.recorded = true;
                            campaign.statistics = statistics;
                            campaign.save(callback);
                        }
                    },
                    callback
                );
            }
        })
    }

    return {
        sendDueCampaigns: sendDueCampaigns,
        getOverallStats: getOverallStats,
        getCampaignStats: getCampaignStats,
        unhashUserMail: unhashUserMail,
        recordStats: recordStats
    };
};