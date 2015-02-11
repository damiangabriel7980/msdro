/**
 * Created by miricaandrei23 on 21.11.2014.
 */
cloudAdminControllers.controller('contactCtrl',['$scope','$stateParams','$modal','$log','$modalInstance','$timeout',function ($scope,$stateParams, $modal, $log,$modalInstance,$timeout) {

    $scope.closeContact = function () {
        $modalInstance.close();
        var $body = angular.element(document.body);
        $body.width("100%");
        angular.element('.navbar').width("50%");
        angular.element('#footer').width("100%");
        //$timeout(function(){
            $body.css("overflow-y", "auto");
        //},100);

    };
}]);