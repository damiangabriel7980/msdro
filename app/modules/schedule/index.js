var schedule = require('node-schedule');

var myCronFormats = {
    atMidnight: '0 0 0 * * *',
    everyHour: '* /1 * * * *',
    everyMinute: '/1 * * * * *'
};

module.exports = function (env, logger) {

    var NewsletterModule = require('../newsletter')(env, logger);

    var dueCampaigns = schedule.scheduleJob(myCronFormats[env.newsletter.scheduleInterval], function () {
        logger.warn("Scheduled job started - due campaigns");
        NewsletterModule.sendDueCampaigns();
    });

    var campaignStatsRecording = schedule.scheduleJob(myCronFormats[env.newsletter.statistics.scheduleInterval], function () {
        logger.warn("Scheduled job started - campaigns stats");
        NewsletterModule.recordStats();
    });

    dueCampaigns.schedule();
    campaignStatsRecording.schedule();
};