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

    multimediaService.getByArea.query({id:$stateParams.idArea}).$promise.then(function(result){
        $scope.multimedias = result;
    });
    angular.element("#footer").css({'position': 'relative','bottom':0});
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
    if($stateParams.idMulti)
    {
        var idM = $stateParams.idMulti;
        $stateParams.idMulti = null;
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
                    return idM;
                }
            }
        });
    }
    $scope.amazonPre = $rootScope.pathAmazonDev;
}])
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').replace(/acirc;/g,'â').replace(/&icirc;/g,'î').replace(/&#351;/g,'ş');
        }
    });
