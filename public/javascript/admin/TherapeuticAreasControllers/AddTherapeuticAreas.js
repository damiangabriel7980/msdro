/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('AddTherapeuticAreas', ['$scope','$rootScope' ,'areasAdminService','$stateParams','$sce','$filter','$modalInstance','$state','therapeuticAreaService', 'Success', 'Error', function($scope,$rootScope,areasAdminService,$stateParams,$sce,$filter,$modalInstance,$state,therapeuticAreaService,Success,Error){

    $scope.resetAlert = function (message, type) {
        $scope.therapeuticAlert = {
            newAlert: message,
            type: type || "danger",
            message: message};
    };
    $scope.resetAlert();

    $scope.modal = {
        title: "Adauga arie",
        action: "Adauga"
    };

    therapeuticAreaService.query().$promise.then(function (resp) {
        var areas = Success.getObject(resp);
        areas = [
            {
                _id: null,
                name: "Fara parinte"
            }
        ].concat(areas);
        $scope.areas = areas;
    }).catch(function(err){
        $scope.resetAlert(Error.getMessage(err));
    });

    $scope.addArie = function(){
        var area = this.arie;
        if(area['therapeutic-areasID']) area['therapeutic-areasID'] = [area['therapeutic-areasID']];
        //console.log(area);
        areasAdminService.areas.create(area).$promise.then(function(){
            $state.reload();
            $modalInstance.close();
        }).catch(function(err){
            $scope.resetAlert(Error.getMessage(err));
        });
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    };
}]);
