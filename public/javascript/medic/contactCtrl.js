/**
 * Created by miricaandrei23 on 21.11.2014.
 */
cloudAdminControllers.controller('contactCtrl',['$scope','$stateParams','$modal','$log','$modalInstance',function ($scope,$stateParams, $modal, $log,$modalInstance) {

    $scope.ok = function () {
        var $body = angular.element(document.body);
        $body.css("overflow", "auto");
        $body.width("100%");
        angular.element('.navbar').width("50%");
        angular.element('#footer').width("100%");
        $modalInstance.close();
    };

    $scope.closeContact = function () {
        var $body = angular.element(document.body);
        $body.css("overflow", "auto");
        $body.width("100%");
        angular.element('.navbar').width("50%");
        angular.element('#footer').width("100%");
        $modalInstance.close();
    };
}])