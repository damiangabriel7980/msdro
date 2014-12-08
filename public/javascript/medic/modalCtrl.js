/**
 * Created by miricaandrei23 on 29.10.2014.
 */
cloudAdminControllers.controller('modalCtrl',['$scope','eventsService2','$stateParams','$modal','$log','$modalInstance','$state',function ($scope,eventsService2,$stateParams, $modal, $log,$modalInstance,$state) {

    $scope.itemsEvent= eventsService2.query({id:$stateParams.id});
    $scope.okk = function () {
        $state.go('calendar');
        $modalInstance.close();
    };

    $scope.cancell = function () {
        $state.go('calendar');
        $modalInstance.dismiss('cancel');
    };
}])
.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});