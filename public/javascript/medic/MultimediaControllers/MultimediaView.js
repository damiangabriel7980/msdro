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


controllers.controller('MultimediaView', ['$scope','$rootScope' ,'multimediaService','$stateParams','$sce','$modal','$window','$timeout','$document','$state', function($scope,$rootScope,multimediaService,$stateParams,$sce,$modal,$window,$timeout,$document,$state){
    window.scrollTo(0,0);
    multimediaService.getByArea.query({id:$stateParams.idArea,specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
        $scope.multimedias = result;
    });
    $scope.status = {
        isopen: false
        //open: false
    };
    $scope.openMultimedia=function(idMultimedia) {
        if($rootScope.deviceWidth<=700)
            $state.go('elearning.multimedia.multimediaMobile',{id: idMultimedia});
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
                    idd: function () {
                        return idMultimedia;
                    }
                }
            });
        }

    };
    if($stateParams.idMulti)
    {
        var idM = $stateParams.idMulti;
        if($rootScope.deviceWidth<=700)
            $state.go('elearning.multimedia.multimediaMobile',{id: idM});
        else{
            $modal.open({
                templateUrl: 'partials/medic/elearning/multimediaDetails.ejs',
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
    }

}]);