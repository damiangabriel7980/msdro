controllers.controller('NewsletterTemplateEdit', ['$scope', 'idToEdit', 'NewsletterService', 'Success', '$modalInstance', 'refreshTemplates', '$modal', function ($scope, idToEdit, NewsletterService, Success, $modalInstance, refreshTemplates, $modal) {

    $scope.variableTypes = NewsletterService.templates.variableTypes;
    $scope.template = {};

    var htmlInfo = "Orice variabila se introduce sub forma *|nume_variablila|* dupa care se alege tipul variabilei in lista din josul ferestrei. " +
                   "Urmatoarele nume sunt rezervate pentru varibilele de sistem si nu vor aparea in lista: ";
    for(var i=0; i<NewsletterService.templates.systemVariables.length; i++){
        htmlInfo += NewsletterService.templates.systemVariables[i] + " ";
    }
    $scope.htmlInfo = htmlInfo;

    NewsletterService.templates.api.query({id: idToEdit}).$promise.then(function (resp) {
        $scope.template = Success.getObject(resp);
    });

    NewsletterService.templates.api.query({returnTypes: true}).$promise.then(function (resp) {
        $scope.types = Success.getObject(resp);
    });

    $scope.closeModal = function () {
        $modalInstance.close();
    };

    $scope.save = function () {
        var toSave = $scope.template;
        NewsletterService.templates.api.update({id: idToEdit}, toSave).$promise.then(function () {
            refreshTemplates();
            $modalInstance.close();
        });
    };

    $scope.preview = function () {
        $modal.open({
            templateUrl: 'partials/admin/newsletter/templates/modalPreviewTemplate.html',
            windowClass: 'fade',
            controller: 'NewsletterTemplatePreview',
            size: 'lg',
            resolve: {
                html: function () {
                    return $scope.template.html;
                }
            }
        });
    };

    $scope.aceOptions ={
        useWrapMode : true,
        showGutter: false,
        mode: 'xml',
        onLoad: aceLoaded,
        onChange: aceChanged
    };

    function aceLoaded(_editor) {
        _editor.$blockScrolling = Infinity;
        _editor.session.setMode("ace/mode/html");
        _editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: false
        });
    }

    function aceChanged(){
        if(!$scope.template) $scope.template = {};
        $scope.template.variables = NewsletterService.templates.parseVariables($scope.template.html, $scope.template.variables);
    }

}]);