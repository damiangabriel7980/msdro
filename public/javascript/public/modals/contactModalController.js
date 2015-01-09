publicControllers.controller('ContactModalController', ['$scope', '$rootScope', '$modalInstance', function($scope, $rootScope, $modalInstance) {

    $scope.closeModal = function(){
        $modalInstance.close();
    }
}]);