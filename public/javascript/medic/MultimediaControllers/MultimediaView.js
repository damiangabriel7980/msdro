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


app.controllerProvider.register('MultimediaView', ['$scope','$rootScope' ,'multimediaService','$stateParams','$sce','$modal','$window','$timeout','$document','$state','Utils', 'Success', 'SpecialFeaturesService', function($scope,$rootScope,multimediaService,$stateParams,$sce,$modal,$window,$timeout,$document,$state,Utils,Success,SpecialFeaturesService){

    SpecialFeaturesService.specialGroups.getSelected().then(function (specialGroupSelected) {
        getMultimedia(specialGroupSelected);
    });

    var getMultimedia = function (specialGroupSelected) {
        multimediaService.multimedia.query({idArea:$stateParams.idArea,specialGroupSelected: specialGroupSelected?specialGroupSelected._id.toString():null}).$promise.then(function(result){
            $scope.multimedias = Success.getObject(result);
        });
    };

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
                    },
                    loadDeps: $rootScope.loadStateDeps(['MultimediaDetail', 'VideoJS'])
                }
            });
        }

    };
    if($stateParams.idMulti)
    {
        $scope.openMultimedia($stateParams.idMulti);
    }

}]);