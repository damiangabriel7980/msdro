cloudAdminControllers.controller('SpecialProductModalController', ['$scope', '$modalInstance', 'intent', 'sessionData', '$sce', '$state', function($scope, $modalInstance, intent, sessionData, $sce, $state) {

    $scope.resetAlert = function (type, text) {
        $scope.alert = {
            type: type?type:"danger",
            show: text?true:false,
            text: text?text:"Unknown error"
        }
    };

    $scope.setSessionData = function (newVal) {
        $scope.sessionData = newVal;
    };

    $scope.renderView = function (view) {
        $scope.resetAlert();
        if(view === "specialProductAdd"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/admin/continut/specialProducts/specialProductAdd.html');
        }else if(view === "specialProductEdit"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/admin/continut/specialProducts/specialProductEdit.html');
        }else if(view === "editProductMenu"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/admin/continut/specialProducts/editProductMenu.html');
        }else if(view === "addMenuItem"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/admin/continut/specialProducts/addMenuItem.html');
        }else if(view === "editMenuItem"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/admin/continut/specialProducts/editMenuItem.html');
        }else if(view === "editGlossary"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/admin/continut/specialProducts/editGlossary.html');
        }else if(view === "editResources"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/admin/continut/specialProducts/editResources.html');
        }
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