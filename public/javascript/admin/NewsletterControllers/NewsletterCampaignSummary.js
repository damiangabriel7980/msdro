controllers.controller('NewsletterCampaignSummary', ['$scope', 'NewsletterService', 'campaign', 'Success', 'Utils', function ($scope, NewsletterService, campaign, Success, Utils) {

    $scope.campaign = campaign;

    $scope.csv = {
        filename: campaign.name+'_'+Utils.customDateFormat(new Date(campaign.send_date), {separator:'-'})+'.csv',
        rows: []
    };

    NewsletterService.statistics.api.query({campaign: campaign._id}).$promise.then(function (resp) {
        var statistics = Success.getObject(resp);
        $scope.csv.rows = formatArrayCSV(NewsletterService.statistics.sanitize(statistics));
        $scope.statistics = statistics;
    });

    function formatArrayCSV(statistics){
        var ret = [];
        for(var key in statistics) {
            if (statistics.hasOwnProperty(key) && key !== 'recorded') {
                ret.push({a: key, b: statistics[key]});
            }
        }
        return ret;
    }

}]);