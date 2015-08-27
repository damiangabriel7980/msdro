controllers.controller('NewsletterDashboard', ['$scope', 'NewsletterService', 'Success', 'Utils', function ($scope, NewsletterService, Success, Utils) {

    $scope.statTypes = [
        {name: "Toate", alias: "all"},
        {name: "Ultimele 7 zile", alias: "last7"},
        {name: "Ultimele 30 zile", alias: "last30"},
        {name: "Ultimele 60 zile", alias: "last60"},
        {name: "Ultimele 90 zile", alias: "last90"}
    ];
    $scope.statType = $scope.statTypes[0].alias;

    $scope.csv = {
        filename: "campanii_MSD_"+Utils.customDateFormat(new Date(), {separator:'-'})+'.csv',
        rows: []
    };

    NewsletterService.statistics.api.query().$promise.then(function (resp) {
        var stats = Success.getObject(resp);
        $scope.campaignStats = {
            all: stats,
            last7: stats.stats.last_7_days,
            last30: stats.stats.last_30_days,
            last60: stats.stats.last_60_days,
            last90: stats.stats.last_90_days
        };
        $scope.csv.rows = formatArrayCSV($scope.campaignStats);
        console.log($scope.campaignStats);
    });

    function formatArrayCSV(statistics){
        var ret = [];
        for(var stat_type in statistics){
            if(statistics.hasOwnProperty(stat_type)){
                ret.push({a: getStatsTitle(stat_type)});
                var stats = NewsletterService.statistics.sanitize(statistics[stat_type]);
                for(var key in stats) {
                    if (stats.hasOwnProperty(key) && key !== 'recorded') {
                        ret.push({a: key, b: stats[key]});
                    }
                }
                ret.push({});
            }
        }
        return ret;
    }

    function getStatsTitle(stat_type){
        for(var i=0; i<$scope.statTypes.length; i++){
            if($scope.statTypes[i].alias === stat_type) return $scope.statTypes[i].name
        }
        return "";
    }

}]);