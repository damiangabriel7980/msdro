/**
 * Created by miricaandrei23 on 29.10.2014.
 */
controllers.controller('EventModal',['$scope','eventsService','$stateParams','$modal','$log','$modalInstance','$state','idEvent','$sce','$timeout', 'Success', 'Error', function ($scope,eventsService,$stateParams, $modal, $log,$modalInstance,$state,idEvent,$sce,$timeout,Success,Error) {

    eventsService.calendar.query({id:idEvent}).$promise.then(function(resp){
       $scope.itemsEvent = Success.getObject(resp);
    }).catch(function(err){
        console.log(Error.getMessage(err.data));
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