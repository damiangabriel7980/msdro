cloudAdminControllers.controller('ContentController', ['$scope', 'ContentService', function($scope, ContentService){

    $scope.newContent = {
        title: "",
        author: "",
        description: "",
        text: "",
        type: "",
        lastUpdated: ""
    };

    $scope.content = ContentService.query();

    $scope.deleteContent = function(id){
        ContentService.update({id: id}, {});
    };

    $scope.addContent = function(){
        if($scope.newContent){
            ContentService.save($scope.newContent).$promise
                .then(function(cont) {
                    $scope.content.push(cont);
                });
            $scope.newContent = {};
        }
    };

}]);