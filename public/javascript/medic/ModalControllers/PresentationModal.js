controllers.controller('PresentationModal', ['$scope', '$rootScope', '$sce', '$modal','$timeout','$state','$modalInstance','IntroService', 'groupID', 'Success', 'Error', function($scope, $rootScope, $sce, $modal,$timeout,$state,$modalInstance,IntroService,groupID,Success,Error) {

    IntroService.presentation.query({groupID: groupID}).$promise.then(function (resp) {
        $scope.presentation = Success.getObject(resp);
    });

    $scope.changeStatus=function(){
        var hideNextTime = !this.rememberOption;
        IntroService.hideNextTime.setStatus(groupID, hideNextTime);
    };

    $scope.closeModal=function(){
        $modalInstance.close();
    };

}]);