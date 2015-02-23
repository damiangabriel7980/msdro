controllers.controller('ProductPageModal', ['$scope', '$modalInstance', 'intent', 'sessionData', '$sce', '$state', function($scope, $modalInstance, intent, sessionData, $sce, $state) {

    $scope.resetAlert = function (type, text) {
        $scope.alert = {
            type: type?type:"danger",
            show: text?true:false,
            text: text?text:"Unknown error"
        }
    };

    $scope.baseModal = {};

    $scope.setSessionData = function (newVal) {
        $scope.sessionData = newVal;
    };

    $scope.renderView = function (view) {
        $scope.resetAlert();
        $scope.modalTemplate = $sce.trustAsResourceUrl('partials/admin/content/specialProducts/'+view+'.html');
    };

    //init view
    $scope.renderView(intent);

    //init session data
    $scope.sessionData = sessionData;

    $scope.closeModal = function(reload){
        if(reload){
            $state.reload();
        }
        $modalInstance.close();
    };

}]);