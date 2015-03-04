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
    $scope.htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').replace(/&acirc;/g,'â').replace(/&icirc;/g,'î').replace(/&Acirc;/g,'Â').replace(/&Icirc;/g,'Î');
    };
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.convertAndTrustAsHtml=function (data) {
        var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        return $sce.trustAsHtml(convertedText);
    };
}])
.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});