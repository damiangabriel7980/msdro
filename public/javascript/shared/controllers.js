controllers.controller('InfoModal', ['$scope','$modalInstance', 'title', 'message', function ($scope, $modalInstance, title, message) {
    $scope.infoModal = {
        title: title,
        message: message
    };

    $scope.closeInfoModal = function () {
        $modalInstance.close();
    }

}]);
controllers.controller('ActionModal', ['$scope','$modalInstance', '$state', 'title', 'message', 'action', 'options', function ($scope, $modalInstance, $state, title, message, action, options) {
    $scope.actionModal = {
        title: title,
        message: message,
        yes: options.yes || "Ok",
        no: options.no || "Inchide"
    };

    $scope.closeActionModal = function () {
        $modalInstance.close();
    };

    $scope.completeActionModal = function () {
        action();
        if(options.reloadState) $state.reload();
        $modalInstance.close();
    }

}]);