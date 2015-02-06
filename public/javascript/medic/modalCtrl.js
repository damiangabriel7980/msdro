/**
 * Created by miricaandrei23 on 29.10.2014.
 */
cloudAdminControllers.controller('modalCtrl',['$scope','eventsService2','$stateParams','$modal','$log','$modalInstance','$state','idEvent','$sce',function ($scope,eventsService2,$stateParams, $modal, $log,$modalInstance,$state,idEvent,$sce) {

   eventsService2.query({id:idEvent}).$promise.then(function(resp){
       $scope.itemsEvent=resp;
    });

    $scope.cancell = function () {
        var $body = angular.element(document.body);
        $body.css("overflow", "auto");
        $body.width("100%");
        angular.element('.navbar').width("50%");
        angular.element('#footer').width("100%");
        $modalInstance.close();
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