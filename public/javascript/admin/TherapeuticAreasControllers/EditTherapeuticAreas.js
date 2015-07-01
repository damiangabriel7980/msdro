/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('EditTherapeuticAreas', ['$scope','$rootScope' ,'areasAdminService','$stateParams','$sce','$filter','$modalInstance','$state','therapeuticAreaService', function($scope,$rootScope,areasAdminService,$stateParams,$sce,$filter,$modalInstance,$state,therapeuticAreaService){
    $scope.therapeuticAlert = {newAlert:false, type:"", message:""};
    therapeuticAreaService.query().$promise.then(function (resp) {
        $scope.areas = resp.success;
    });
    areasAdminService.areas.query({id:$stateParams.id}).$promise.then(function(resp){
        $scope.arie = resp.success['selectedArea'];
        $scope.selectedAreas = resp.success['childrenAreas'] ? resp.success['childrenAreas']: [];
        $scope.oldAreas = [];
        if(resp.success['childrenAreas']){
            for ( var i = 0;i<resp.success['childrenAreas'].length;i++)
                $scope.oldAreas.push(resp.success['childrenAreas'][i]);
        }
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
            });
        }
        else{
            $scope.therapeuticAlert.newAlert = true;
            $scope.therapeuticAlert.message = "Numele ariei terapeutice este obligatoriu!";
            $scope.therapeuticAlert.type = "danger";
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
