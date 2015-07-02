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


controllers.controller('MultimediaView', ['$scope','$rootScope' ,'multimediaService','$stateParams','$sce','$modal','$window','$timeout','$document','$state','Utils', 'Success', 'Error', function($scope,$rootScope,multimediaService,$stateParams,$sce,$modal,$window,$timeout,$document,$state,Utils,Success,Error){
    window.scrollTo(0,0);
    multimediaService.multimedia.query({idArea:$stateParams.idArea,specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
        $scope.multimedias = Success.getObject(result);
    }).catch(function(err){
        console.log(Error.getMessage(err.data));
    });
    $scope.status = {
        isopen: false
        //open: false
    };
    $scope.openMultimedia=function(multimedia) {
        if(multimedia._id) multimedia = multimedia._id;
        if(Utils.isMobile(true))
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