/**
 * Created by miricaandrei23 on 29.10.2014.
 */
controllers.controller('EventModal',['$scope','eventsService2','$stateParams','$modal','$log','$modalInstance','$state','idEvent','$sce','$timeout',function ($scope,eventsService2,$stateParams, $modal, $log,$modalInstance,$state,idEvent,$sce,$timeout) {

   eventsService2.query({id:idEvent}).$promise.then(function(resp){
       $scope.itemsEvent=resp;
    });

    $scope.cancell = function () {
        $modalInstance.close();
        $stateParams.id=null;
    };
}])
.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});