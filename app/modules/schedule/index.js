var schedule = require('node-schedule');
var NewsletterModule = require('../newsletter');

var myCronFormats = {
    atMidnight: '0 0 0 * * *',
    everyHour: '* /1 * * * *',
    everyMinute: '/1 * * * * *'
};

module.exports = function (env) {
    var dueCampaigns = schedule.scheduleJob(myCronFormats[env.newsletter.scheduleInterval], function () {
        console.log("Scheduled job started - due campaigns");
        NewsletterModule.sendDueCampaigns();
    });

    dueCampaigns.schedule();
};