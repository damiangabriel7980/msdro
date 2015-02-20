/**
 * @ngdoc controller
 * @name controllers.controller:therapeuticControllerCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


controllers.controller('TherapeuticAreas', ['$scope', 'therapeuticAreaService','$sce', function($scope, therapeuticAreaService,$sce){

   therapeuticAreaService.query().$promise.then(function(correctResults){
       $scope.therapeuticAreas = correctResults;
    });
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.convertAndTrustAsHtml=function (data) {
        var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        return $sce.trustAsHtml(convertedText);
    };
    //
    //$scope.toggleActive = function(){
    //    $('.list-group li').removeClass('active');
    //    $(this).addClass('active');
    //}

 }]);



