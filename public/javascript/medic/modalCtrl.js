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
    $scope.htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').replace(/&acirc;/g,'â').replace(/&icirc;/g,'î').replace(/&#351;/g,'ş');
    };
}])
.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});