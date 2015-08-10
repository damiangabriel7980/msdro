controllers.controller('NewsletterCampaignEdit',['$scope', 'NewsletterService', 'idToEdit', 'Success', '$modalInstance', 'refreshCampaigns', function ($scope, NewsletterService, idToEdit, Success, $modalInstance, refreshCampaigns) {

    NewsletterService.campaigns.query({id: idToEdit}).$promise.then(function (resp) {
        var campaign = Success.getObject(resp);
        $scope.campaign = campaign;
        $scope.selectedDistributionLists = campaign.distribution_lists || [];
    });

    NewsletterService.distributionLists.query().$promise.then(function (resp) {
        $scope.distributionLists = Success.getObject(resp);
    });

    $scope.save = function () {
        var toSave = $scope.campaign;
        toSave.distribution_lists = $scope.selectedDistributionListsIds;
        NewsletterService.campaigns.update({id: idToEdit}, toSave).$promise.then(function () {
            refreshCampaigns();
            $modalInstance.close();
        });
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    }

}]);