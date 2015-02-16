cloudAdminControllers.controller('SpecialProductModalController', ['$scope', '$modalInstance', 'intent', 'sessionData', '$sce', '$state', function($scope, $modalInstance, intent, sessionData, $sce, $state) {

    $scope.resetAlert = function (type, text) {
        $scope.alert = {
            type: type?type:"danger",
            show: text?true:false,
            text: text?text:"Unknown error"
        }
    };

    $scope.$watch('intent', function () {
        $scope.renderView(intent);
    });

    $scope.$watch('sessionData', function () {
        $scope.sessionData = sessionData;
    });

    $scope.renderView = function (view) {
        $scope.resetAlert();
        if(view === "specialProductAdd"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/admin/continut/specialProducts/specialProductAdd.html');
        }
    };

    $scope.closeModal = function(reload){
        if(reload){
            $state.reload();
        }
        $modalInstance.close();
    };

}]);