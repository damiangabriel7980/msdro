controllers.controller('CostsEdit', ['$scope', '$state', 'idToEdit', 'UserCostsService', 'Success', '$modalInstance', 'InfoModal', function ($scope, $state, idToEdit, UserCostsService, Success, $modalInstance, InfoModal) {

    //===================================== get all the data from server
    UserCostsService.users.query({id: idToEdit}).$promise.then(function (resp) {
        var user = Success.getObject(resp);
        $scope.user = user;
    });

    //================================================= functions

    //form submission
    $scope.save = function () {
        var user = $scope.user;
        UserCostsService.users.update({id: user._id}, user).$promise.then(function (resp) {
            $state.reload();
            $modalInstance.close();
        }).catch(function (err) {
            InfoModal.show("Atentie", err.data.error);
        });
    };

    $scope.resetAlert = function (text, type) {
        $scope.alert = {
            text: text,
            type: type || "danger"
        };
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    };

}]);