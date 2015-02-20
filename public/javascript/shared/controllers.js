controllers.controller('InfoModal', ['$scope','$modalInstance', 'title', 'message', function ($scope, $modalInstance, title, message) {
    $scope.infoModal = {
        title: title,
        message: message
    };

    $scope.closeInfoModal = function () {
        $modalInstance.close();
    }

}]);
controllers.controller('ActionModal', ['$scope','$modalInstance', '$state', 'title', 'message', 'action', 'actionName', 'reloadState', function ($scope, $modalInstance, $state, title, message, action, actionName, reloadState) {
    $scope.actionModal = {
        title: title,
        message: message,
        actionName: actionName || "Ok"
    };

    //reloadState defaults to true
    if(typeof reloadState == "undefined") reloadState = true;

    $scope.closeActionModal = function () {
        $modalInstance.close();
    };

    $scope.completeActionModal = function () {
        action();
        if(reloadState) $state.reload();
        $modalInstance.close();
    }

}]);