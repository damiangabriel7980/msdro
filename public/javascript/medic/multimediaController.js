/**
 * Created by miricaandrei23 on 04.11.2014.
 */
/**
 * @ngdoc controller
 * @name cloudAdminControllers.controller:science_articlesCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


cloudAdminControllers.controller('multimediaController', ['$scope','$rootScope' ,'multimediaService','$stateParams','$sce','$modal', function($scope,$rootScope,multimediaService,$stateParams,$sce,$modal){

    multimediaService.getByArea.query({id:$stateParams.id}).$promise.then(function(result){
        $scope.multimedias = result;
    });
    $scope.openMultimedia=function(idMultimedia) {
        $modal.open({
            templateUrl: 'partials/medic/elearning/multimediaDetails.ejs',
            windowTemplateUrl: 'partials/medic/modals/responsiveModalTemplate.html',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            windowClass: 'fade',
            controller: 'multimediaDetailsController',
            resolve:{
                idd: function () {
                    return idMultimedia;
                }
            }
        });
    };
    $scope.amazonPre = $rootScope.pathAmazonDev;
    if($rootScope.previousState==='home')
        console.log('Am fost acasa');
    console.log($rootScope.currentState);
}])
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        }
    });
