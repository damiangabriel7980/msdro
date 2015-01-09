/**
 * Created by miricaandrei23 on 29.10.2014.
 */
cloudAdminControllers.controller('modalCtrl',['$scope','eventsService2','$stateParams','$modal','$log','$modalInstance','$state',function ($scope,eventsService2,$stateParams, $modal, $log,$modalInstance,$state) {

    $scope.itemsEvent= eventsService2.query({id:$stateParams.id});

    $scope.cancell = function () {
        window.history.back();
        $modalInstance.dismiss('cancel');
        //$state.go('calendar');
    };
}])
.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});