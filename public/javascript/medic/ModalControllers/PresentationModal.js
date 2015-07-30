app.controllerProvider.register('PresentationModal', ['$scope', '$rootScope', '$sce', '$modal','$timeout','$state','$modalInstance','IntroService', 'groupID', 'Success', 'Error', function($scope, $rootScope, $sce, $modal,$timeout,$state,$modalInstance,IntroService,groupID,Success,Error) {

    IntroService.presentation.query({groupID: groupID}).$promise.then(function (resp) {
        $scope.presentation = Success.getObject(resp);
    });

    $scope.changeStatus=function(){
        var hideNextTime = !this.rememberOption;
        IntroService.hideNextTime.setStatus(groupID, hideNextTime);
    };

    $scope.closeModal=function(){
        if(angular.element('video')[0])
            angular.element('video')[0].pause();
        $modalInstance.close();
    };

}]);