/**
 * Created by miricaandrei23 on 29.10.2014.
 */
cloudAdminControllers.controller('modalCtrl',['$scope','eventsService2','$stateParams','$modal','$log','$modalInstance','$state','idEvent',function ($scope,eventsService2,$stateParams, $modal, $log,$modalInstance,$state,idEvent) {

    $scope.itemsEvent= eventsService2.query({id:idEvent});

    $scope.cancell = function () {
        $modalInstance.close();
    };
}])
.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});