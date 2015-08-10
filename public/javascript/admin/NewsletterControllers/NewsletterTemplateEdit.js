controllers.controller('NewsletterTemplateEdit', ['$scope', 'idToEdit', 'NewsletterService', 'Success', '$modalInstance', 'refreshTemplates', function ($scope, idToEdit, NewsletterService, Success, $modalInstance, refreshTemplates) {

    $scope.variableTypes = ["text", "html", "system"];
    $scope.template = {};

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