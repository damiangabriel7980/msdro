app.controllerProvider.register('PresentationModal', ['$scope', '$rootScope', '$sce', '$modal','$timeout','$state','$modalInstance','IntroService', 'groupID', 'Success', 'Error', function($scope, $rootScope, $sce, $modal,$timeout,$state,$modalInstance,IntroService,groupID,Success,Error) {

    $scope.showNextTime = true;

    IntroService.presentation.query({groupID: groupID}).$promise.then(function (resp) {
        $scope.presentation = Success.getObject(resp);
    });

    $scope.changeStatus=function(){
        IntroService.hideNextTime.setStatus(groupID, !$scope.showNextTime);
    };

    $scope.closeModal=function(){
        if(angular.element('video')[0])
            angular.element('video')[0].pause();
        $modalInstance.close();
    };

}]);