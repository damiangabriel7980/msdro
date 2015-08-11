controllers.controller('NewsletterCampaignPopulateTemplate',['$scope', 'NewsletterService', 'Success', '$modalInstance', 'template', 'templatesById', function ($scope, NewsletterService, Success, $modalInstance, template, templatesById) {

    $scope.templateInfo = templatesById[template.id];
    console.log($scope.templateInfo);
    $scope.template = template;

    $scope.$watch('template.variables', function (newVariables) {
        $scope.templatePreview = NewsletterService.templates.renderTemplate($scope.templateInfo.html, newVariables || []);
    });

    $scope.closeModal = function () {
        $modalInstance.close();
    };

    function findVariableByName(variables, name){
        for(var i=0; i<variables.length; i++){
            if(variables[i].name === name) return i;
        }
        return null;
    }

}]);