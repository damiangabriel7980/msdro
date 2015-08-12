var async = require('async');
var Q = require('q');

var Newsletter = {
    distributionLists: require('../../models/newsletter/distribution_lists'),
    campaigns: require('../../models/newsletter/campaigns'),
    templates: require('../../models/newsletter/templates')
};

module.exports = function (logger) {
    var sendCampaign = function (campaign_id) {
        var deferred = Q.defer();
        Newsletter.campaigns.findOne({_id: campaign_id}, function (err, campaign) {
            if(err){
                deferred.reject(err);
            }else if(!campaign){
                deferred.reject("Campaign not found");
            }else{
                console.log("Send campaign - "+campaign.name);
                deferred.resolve();
            }
        });
        return deferred.promise;
    };

    var sendDueCampaigns = function () {
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
    };

    return {
        sendDueCampaigns: sendDueCampaigns
    };
};