controllers.controller('NewsletterDistributionListEdit', ['$scope', 'idToEdit', 'NewsletterService', 'GroupsService', 'Success', '$modalInstance', 'refreshLists', function ($scope, idToEdit, NewsletterService, GroupsService, Success, $modalInstance, refreshLists) {

    NewsletterService.distributionLists.query({id: idToEdit}).$promise.then(function (resp) {
        var list = Success.getObject(resp);
        $scope.list = list;
        $scope.selectedGroups = list.user_groups || [];
    });

    GroupsService.groups.query().$promise.then(function (resp) {
        $scope.groups = Success.getObject(resp);
    });

    $scope.closeModal = function () {
        $modalInstance.close();
    };

    $scope.save = function () {
        var toSave = $scope.list;
        toSave.user_groups = $scope.selectedGroupsIds;
        console.log(toSave);
        NewsletterService.distributionLists.update({id: idToEdit}, toSave).$promise.then(function () {
            refreshLists();
            $modalInstance.close();
        });
    }

}]);