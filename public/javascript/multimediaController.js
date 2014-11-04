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


cloudAdminControllers.controller('multimediaController', ['$scope','$rootScope' ,'multimediaService','$stateParams','$sce', function($scope,$rootScope,multimediaService,$stateParams,$sce){

    multimediaService.getByArea.query({id:$stateParams.id}).$promise.then(function(result){
        $scope.multimedias = result;
    });
    $scope.amazon = $rootScope.pathAmazonDev;
}])
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        }
    });
