/**
 * Created by miricaandrei23 on 29.10.2014.
 */
cloudAdminControllers.controller('modalCtrl',['$scope','eventsService2','$stateParams','$modal','$log','$modalInstance','$state','idEvent',function ($scope,eventsService2,$stateParams, $modal, $log,$modalInstance,$state,idEvent) {

   eventsService2.query({id:idEvent}).$promise.then(function(resp){
       $scope.itemsEvent=resp;
    });

    $scope.cancell = function () {
        $modalInstance.close();
    };
    var htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
    };
}])
.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});