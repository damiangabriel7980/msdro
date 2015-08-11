controllers.controller('NewsletterCampaignPopulateTemplate',['$scope', 'NewsletterService', 'Success', '$modalInstance', 'template', 'templatesById', function ($scope, NewsletterService, Success, $modalInstance, template, templatesById) {

    var templateInfo = templatesById[template.id];

    //sync template variables with template model
    var synced = [];
    for(var i=0; i<templateInfo.variables.length; i++){
        var variable = findVariableByName(template.variables, templateInfo.variables[i].name, true);
        if(variable !== null && variable.type === templateInfo.variables[i].type && variable.name === templateInfo.variables[i].name){
            synced.push({
                name: variable.name,
                type: variable.type,
                value: variable.value
            });
        }else{
            synced.push({
                name: templateInfo.variables[i].name,
                type: templateInfo.variables[i].type,
                value: ""
            });
        }
    }
    template.variables = synced;

    //export our data to scope
    $scope.template = template;

    //TODO: dynamically assign system variables
    $scope.systemVariables = ["test1", "test2"];

    $scope.$watch('template.variables', function (newVariables) {
        $scope.templatePreview = NewsletterService.templates.renderTemplate(templateInfo.html, newVariables || []);
    }, true);

    $scope.closeModal = function () {
        $modalInstance.close();
    };

    function findVariableByName(variables, name, returnEntireObject){
        for(var i=0; i<variables.length; i++){
            if(variables[i].name === name) return returnEntireObject?variables[i]:i;
        }
        return null;
    }

    $scope.tinymceOptions = {};

}]);