var schedule = require('node-schedule');
var Q = require('q');

var myCronFormats = {
    atMidnight: '0 0 0 * * *',
    everyHour: '* /1 * * * *',
    everyMinute: '/1 * * * * *'
};

var lockSchedule = {};

module.exports = function (env, logger) {

    var NewsletterModule = require('../newsletter')(env, logger);

    var dueCampaigns = createUnparallelScheduledJob("due campaigns", myCronFormats[env.newsletter.scheduleInterval], NewsletterModule.sendDueCampaigns);
    var campaignStatsRecording = createUnparallelScheduledJob("campaign stats", myCronFormats[env.newsletter.statistics.scheduleInterval], NewsletterModule.recordStats);

    //var test = createUnparallelScheduledJob("test", myCronFormats["everyMinute"], ceva);
    //
    //function ceva() {
    //    var deferred = Q.defer();
    //    setTimeout(function () {
    //        logger.warn("Ceva");
    //        deferred.resolve();
    //    }, 120*1000); //2 minutes
    //    return deferred.promise;
    //}

    function createUnparallelScheduledJob(name, cron, taskFuncPointer) {
        return schedule.scheduleJob(cron, function () {
            if(!lockSchedule[name]){
                lockSchedule[name] = true;
                logger.warn("job started - "+name);
                var task = taskFuncPointer();
                if(task.then){
                    task.then(
                        function (success) {
                            if(success) logger.warn(success);
                            logger.warn("job finished - "+name);
                            lockSchedule[name] = false;
                        },
                        function (err) {
                            logger.warn(err);
                            lockSchedule[name] = false;
                        }
                    );
                }else{
                    lockSchedule[name] = false;
                }
            }
        });
    }
};