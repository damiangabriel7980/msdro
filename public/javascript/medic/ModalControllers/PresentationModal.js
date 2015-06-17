controllers.controller('PresentationModal', ['$scope', '$rootScope', '$sce', '$modal','$timeout','$state','$modalInstance','IntroService', 'groupID', function($scope, $rootScope, $sce, $modal,$timeout,$state,$modalInstance,IntroService,groupID) {

    IntroService.presentation.query({groupID: groupID}).$promise.then(function (resp) {
        $scope.presentation = resp.success;
    });

    $scope.changeStatus=function(){
        var hideNextTime = !this.rememberOption;
        IntroService.hideNextTime.setStatus(groupID, hideNextTime);
    };

    $scope.closeModal=function(){
        $modalInstance.close();
    };

}]);