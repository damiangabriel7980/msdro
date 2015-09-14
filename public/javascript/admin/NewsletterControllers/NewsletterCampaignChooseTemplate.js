controllers.controller('NewsletterCampaignChooseTemplate',['$scope', 'NewsletterService', 'Success', '$modalInstance', 'templates', function ($scope, NewsletterService, Success, $modalInstance, templates) {

    NewsletterService.templates.api.query({returnTypes: true}).$promise.then(function (resp) {
        $scope.templateTypes = Success.getObject(resp);
    });

    console.log(templates);

    $scope.$watch('templateType', function (newVal) {
        if(newVal){
            NewsletterService.templates.api.query({type: newVal}).$promise.then(function (resp) {
                $scope.templatesPreview = Success.getObject(resp);
            });
        }
    });

    $scope.addTemplate = function (template) {
        templates.push({
            id: template._id,
            variables: [],
            order: templates.length
        });
        $modalInstance.close();
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    }

}]);