controllers.controller('NewsletterCampaignSummary', ['$scope', 'NewsletterService', 'campaign_id', 'Success', function ($scope, NewsletterService, campaign_id, Success) {

    NewsletterService.statistics.query({campaign: campaign_id}).$promise.then(function (resp) {
        $scope.statistics = Success.getObject(resp);
    })

}]);