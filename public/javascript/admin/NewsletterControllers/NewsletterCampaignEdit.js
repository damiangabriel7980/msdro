controllers.controller('NewsletterCampaignEdit',['$scope', 'NewsletterService', 'idToEdit', 'Success', '$modalInstance', 'refreshCampaigns', '$modal', function ($scope, NewsletterService, idToEdit, Success, $modalInstance, refreshCampaigns, $modal) {

    NewsletterService.campaigns.query({id: idToEdit}).$promise.then(function (resp) {
        var campaign = Success.getObject(resp);
        $scope.campaign = campaign;
        $scope.campaign.templates = $scope.campaign.templates || [];
        $scope.selectedDistributionLists = campaign.distribution_lists || [];
    });

    NewsletterService.templates.api.query().$promise.then(function (resp) {
        var templates = Success.getObject(resp);
        var templatesById = {};
        for(var i=0; i<templates.length; i++){
            templatesById[templates[i]._id] = templates[i];
        }
        $scope.templatesById = templatesById;
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

    $scope.addTemplate = function () {
        $modal.open({
            templateUrl: 'partials/admin/newsletter/campaigns/chooseTemplate.html',
            windowClass: 'fade',
            controller: 'NewsletterCampaignChooseTemplate',
            resolve: {
                templates: function () {
                    return $scope.campaign.templates;
                }
            }
        });
    };

    $scope.editTemplate = function (index) {
        console.log(index);
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    }

}]);