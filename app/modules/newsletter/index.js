var async = require('async');
var Q = require('q');

var Newsletter = {
    distributionLists: require('../../models/newsletter/distribution_lists'),
    campaigns: require('../../models/newsletter/campaigns'),
    templates: require('../../models/newsletter/templates')
};

var Users = require('../../models/user');

module.exports = function (logger) {
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
                            callback(err);
                        }
                    )
                }, function (err) {
                    if(err){
                        logger.error(err);
                    }else{
                        logger.info("Sent all campaigns");
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
                Q.all([
                    getEmails(campaign.distribution_lists),
                    populateTemplates(campaign.templates)
                ]).then(
                    function (results) {
                        var users = results[0];
                        var html = results[1];
                        console.log(users);
                        console.log(html);
                        deferred.resolve();
                    },
                    function (err) {
                        deferred.reject(err);
                    }
                );
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
                deferred.resolve(concatArraysUnique(results[0], results[1]));
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
                Users.distinct("username", {groupsID: {$in: groupsIds}}, function (err, usernames) {
                    if(err){
                        deferred.reject(err);
                    }else{
                        deferred.resolve(usernames);
                    }
                });
            }
        });
        return deferred.promise;
    }

    function getEmailsFromCustomLists(distributionListsIds) {
        var deferred = Q.defer();
        Newsletter.distributionLists.distinct("emails", {_id: {$in: distributionListsIds}}, function (err, customEmails) {
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(customEmails);
            }
        });
        return deferred.promise;
    }

    function concatArraysUnique(array1, array2){
        for(var i=0; i<array2.length; i++){
            if(array1.indexOf(array2[i]) === -1){
                array1.push(array2[i]);
            }
        }
        return array1;
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
            if(variables[i] && ["text", "html"].indexOf(variables[i].type) > -1 && variables[i].value){
                templateHtml = templateHtml.replace(new RegExp("\\*\\|"+variables[i].name+"\\|\\*", "g"), variables[i].value);
            }
        }
        return templateHtml;
    }

    return {
        sendDueCampaigns: sendDueCampaigns
    };
};