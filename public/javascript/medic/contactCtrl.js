/**
 * Created by miricaandrei23 on 21.11.2014.
 */
cloudAdminControllers.controller('contactCtrl',['$scope','$stateParams','$modal','$log','$modalInstance',function ($scope,$stateParams, $modal, $log,$modalInstance) {

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.closeContact = function () {
        $modalInstance.close();
    };
}])