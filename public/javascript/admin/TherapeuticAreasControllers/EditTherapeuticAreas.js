/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('EditTherapeuticAreas', ['$scope','$rootScope' ,'areasAdminService','$stateParams','$sce','$filter','$modalInstance','$state','therapeuticAreaService','Success','Error', function($scope,$rootScope,areasAdminService,$stateParams,$sce,$filter,$modalInstance,$state,therapeuticAreaService,Success,Error){

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
        $scope.areas = Success.getObject(resp)
    }).catch(function(err){
        $scope.resetAlert(Error.getMessage(err));
    });
    areasAdminService.areas.query({id:$stateParams.id}).$promise.then(function(resp){
        $scope.arie = Success.getObject(resp)['selectedArea'];
        $scope.selectedAreas = Success.getObject(resp)['childrenAreas'] ? Success.getObject(resp)['childrenAreas']: [];
        $scope.oldAreas = [];
        if(Success.getObject(resp)['childrenAreas']){
            for ( var i = 0;i<Success.getObject(resp)['childrenAreas'].length;i++)
                $scope.oldAreas.push(Success.getObject(resp)['childrenAreas'][i]);
        }
    }).catch(function(err){
        $scope.resetAlert(Error.getMessage(err));
    });


    $scope.updateArie = function(){
        if($scope.arie && $scope.arie.name!=""){
            $scope.newAreas = $scope.returnedAreas;
            $scope.arie.last_updated = new Date();
            $scope.arie['therapeutic-areasID'] = [];
            console.log($scope.arie);
            areasAdminService.areas.update({id:$stateParams.id},{area:$scope.arie, oldAreas: $scope.oldAreas, newAreas: $scope.newAreas}).$promise.then(function(resp){
                $scope.arie = {};
                $modalInstance.close();
                $state.go('ariiTerapeutice',{},{reload: true});
            }).catch(function(err){
                $scope.resetAlert(Error.getMessage(err));
            });
        }
        else{
            $scope.resetAlert("Numele ariei terapeutice este obligatoriu!");
        }
    };


    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        $modalInstance.close();
        $state.go('ariiTerapeutice',{},{reload: true});
    };
}]);
