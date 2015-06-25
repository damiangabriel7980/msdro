/**
 * Created by miricaandrei23 on 29.10.2014.
 */
controllers.controller('EventModal',['$scope','eventsService','$stateParams','$modal','$log','$modalInstance','$state','idEvent','$sce','$timeout',function ($scope,eventsService,$stateParams, $modal, $log,$modalInstance,$state,idEvent,$sce,$timeout) {

    eventsService.calendar.query({id:idEvent}).$promise.then(function(resp){
       $scope.itemsEvent=resp.success;
    });

    $scope.closeModal = function () {
        $modalInstance.close();
        $stateParams.id=null;
    };
}])
.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});