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


controllers.controller('MultimediaView', ['$scope','$rootScope' ,'multimediaService','$stateParams','$sce','$modal','$window','$timeout','$document','$state','Utils', function($scope,$rootScope,multimediaService,$stateParams,$sce,$modal,$window,$timeout,$document,$state,Utils){
    window.scrollTo(0,0);
    multimediaService.getByArea.query({id:$stateParams.idArea,specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
        $scope.multimedias = result;
    });
    $scope.status = {
        isopen: false
        //open: false
    };
    $scope.isMobile = Utils.isMobile(true,false);
    $scope.openMultimedia=function(multimedia) {
        if(multimedia._id) multimedia = multimedia._id;
        if($scope.isMobile)
            $state.go('elearning.multimedia.multimediaMobile',{id: multimedia});
        else
        {
            $modal.open({
                templateUrl: 'partials/medic/elearning/multimediaDetails.ejs',
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                windowClass: 'fade',
                controller: 'MultimediaDetail',
                resolve:{
                    idMultimedia: function () {
                        return multimedia;
                    }
                }
            });
        }

    };
    if($stateParams.idMulti)
    {
        $scope.openMultimedia($stateParams.idMulti);
    }

}]);