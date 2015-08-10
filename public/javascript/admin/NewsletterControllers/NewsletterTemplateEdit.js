controllers.controller('NewsletterTemplateEdit', ['$scope', 'idToEdit', 'NewsletterService', 'Success', '$modalInstance', 'refreshTemplates', function ($scope, idToEdit, NewsletterService, Success, $modalInstance, refreshTemplates) {

    NewsletterService.templates.query({id: idToEdit}).$promise.then(function (resp) {
        resp = Success.getObject(resp);
        $scope.template = resp.template;
        $scope.types = resp.types;
    });

    $scope.closeModal = function () {
        $modalInstance.close();
    };

    $scope.save = function () {
        var toSave = $scope.template;
        NewsletterService.templates.update({id: idToEdit}, toSave).$promise.then(function () {
            refreshTemplates();
            $modalInstance.close();
        });
    }

}]);