/**
 * Created by miricaandrei23 on 29.10.2014.
 */
cloudAdminControllers.controller('modalCtrl',['$scope','eventsService2','$stateParams','$modal','$log','$modalInstance',function ($scope,eventsService2,$stateParams, $modal, $log,$modalInstance) {

    $scope.itemsEvent= eventsService2.query({id:$stateParams.id});
    $scope.okk = function () {
        $modalInstance.close();
    };

    $scope.cancell = function () {
        $modalInstance.dismiss('cancel');
    };
}])
.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});