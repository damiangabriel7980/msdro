/**
 * Created by miricaandrei23 on 04.11.2014.
 */
/**
 * @ngdoc controller
 * @name controllers.controller:science_articlesCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


controllers.controller('MultimediaView', ['$scope','$rootScope' ,'multimediaService','$stateParams','$sce','$modal','$window','$timeout','$document', function($scope,$rootScope,multimediaService,$stateParams,$sce,$modal,$window,$timeout,$document){
    window.scrollTo(0,0);
    multimediaService.getByArea.query({id:$stateParams.idArea,specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
        $scope.multimedias = result;
    });

    $scope.openMultimedia=function(idMultimedia) {
        $modal.open({
            templateUrl: 'partials/medic/elearning/multimediaDetails.ejs',
            //windowTemplateUrl: 'partials/medic/modals/responsiveModalTemplate.html',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            windowClass: 'fade',
            controller: 'MultimediaDetail',
            resolve:{
                idd: function () {
                    return idMultimedia;
                }
            }
        });
    };
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.convertAndTrustAsHtml=function (data,limit) {
        if(limit!=0)
            var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').substring(0,limit) + '...';
        else
            var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        return $sce.trustAsHtml(convertedText);
    };
    if($stateParams.idMulti)
    {
        var idM = $stateParams.idMulti;
        $stateParams.idMulti = null;
        $modal.open({
            templateUrl: 'partials/medic/elearning/multimediaDetails.ejs',
            //windowTemplateUrl: 'partials/medic/modals/responsiveModalTemplate.html',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            windowClass: 'fade',
            controller: 'MultimediaDetail',
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
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').replace(/&acirc;/g,'â').replace(/&icirc;/g,'î').replace(/&#351;/g,'ş').replace(/&Acirc;/g,'Â').replace(/&Icirc;/g,'Î');
        }
    });
