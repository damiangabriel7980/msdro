/**
 * Created by andreimirica on 28.04.2016.
 */
app.controllerProvider.register('PathologyController', ['$scope', '$rootScope', '$stateParams', '$state', '$timeout', 'Success', 'Error', 'PathologiesService', 'IntroService', '$modal', function($scope, $rootScope, $stateParams, $state, $timeout, Success, Error, PathologiesService, IntroService, $modal){

    PathologiesService.pathologies.query({id: $stateParams.pathology_id}).$promise.then(function(response){
        $scope.pathology = Success.getObject(response)[0];
        if($scope.pathology.video_intro){
            //Check if user already viewed the pathology video in this session
            IntroService.rememberIntroView.query({groupID: $scope.pathology._id, cache: new Date()}).$promise.then(function (resp) {
                if(!Success.getObject(resp).isViewed){
                    //if not, mark as viewed
                    IntroService.rememberIntroView.save({groupID: $scope.pathology._id}).$promise.then(function () {
                        $modal.open({
                            templateUrl: 'partials/medic/modals/pathologyModal.html',
                            keyboard: false,
                            backdrop: 'static',
                            windowClass: 'fade',
                            controller: 'PathologyModal',
                            resolve: {
                                videoURL: function () {
                                    return $rootScope.pathAmazonDev + $scope.pathology.video_intro;
                                },
                                pathologyName: function () {
                                    return $scope.pathology.display_name;
                                },
                                loadDeps: $rootScope.loadStateDeps(['PathologyModal'])
                            }
                        });
                    });
                }
            });
        }
    });

}]);