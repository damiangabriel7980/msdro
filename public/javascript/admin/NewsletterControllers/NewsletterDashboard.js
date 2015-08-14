controllers.controller('NewsletterDashboard', ['$scope', 'NewsletterService', 'Success', function ($scope, NewsletterService, Success) {

    $scope.statTypes = [
        {name: "Toate", alias: "all"},
        {name: "Ultimele 7 zile", alias: "last7"},
        {name: "Ultimele 30 zile", alias: "last30"},
        {name: "Ultimele 60 zile", alias: "last60"},
        {name: "Ultimele 90 zile", alias: "last90"}
    ];
    $scope.statType = $scope.statTypes[0].alias;

    NewsletterService.statistics.query().$promise.then(function (resp) {
        var stats = Success.getObject(resp);
        $scope.campaignStats = {
            all: stats,
            last7: stats.stats.last_7_days,
            last30: stats.stats.last_30_days,
            last60: stats.stats.last_60_days,
            last90: stats.stats.last_90_days
        };
        console.log($scope.campaignStats);
    });

}]);