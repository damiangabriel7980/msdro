controllers.controller('InfoModal', ['$scope','$modalInstance', 'title', 'message', function ($scope, $modalInstance, title, message) {
    $scope.infoModal = {
        title: title,
        message: message
    };

    $scope.closeInfoModal = function () {
        $modalInstance.close();
    }

}]);