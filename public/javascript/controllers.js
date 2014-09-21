var cloudAdminControllers = angular.module('cloudAdminControllers', ['ui.bootstrap']);


cloudAdminControllers.controller('AddChildren', ['$scope', 'ChildrenService', function($scope, ChildrenService){

    $scope.showForm = false;

    $scope.newChild = {
        name: "",
        surname: ""
    };

    $scope.children = ChildrenService.query();

    $scope.deleteChild = function(childId){
        ChildrenService.delete({id: childId});
        $scope.children = $scope.children.filter(function(child){ return (child._id != childId); })
//        $scope.children = ChildrenService.query();
    };

    $scope.addChild = function(){
        if($scope.newChild){
            ChildrenService.save($scope.newChild).$promise
                .then(function(child) {
                    $scope.children.push(child);
                });
            $scope.newChild = {};
        }
    };

}]);