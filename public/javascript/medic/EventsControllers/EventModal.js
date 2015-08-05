/**
 * Created by miricaandrei23 on 29.10.2014.
 */
app.controllerProvider.register('EventModal',['$scope','eventsService','$stateParams','$modal','$log','$modalInstance','$state','idEvent','$sce','$timeout', 'Success', 'Error','HomeService', function ($scope,eventsService,$stateParams, $modal, $log,$modalInstance,$state,idEvent,$sce,$timeout,Success,Error , HomeService) {

    eventsService.calendar.query({id:idEvent}).$promise.then(function(resp){
       $scope.itemsEvent = Success.getObject(resp);
       $scope.totalItems=$scope.itemsEvent.speakers.length;
        console.log("====================================");
        console.log($scope.itemsEvent);
    });
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.isCollapsed = true;
    console.log($scope.totalItems);


    $scope.closeModal = function () {
        $state.go('calendar',{id: null}, {}, {reload: true});
        $modalInstance.close();
        $stateParams.id=null;
    };
}]);
app.filterProvider.register("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});