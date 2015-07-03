/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('EditTherapeuticAreas', ['$scope','$rootScope' ,'areasAdminService','$stateParams','$sce','$filter','$modalInstance','$state','therapeuticAreaService','Success','Error', function($scope,$rootScope,areasAdminService,$stateParams,$sce,$filter,$modalInstance,$state,therapeuticAreaService,Success,Error){
    $scope.therapeuticAlert = {newAlert:false, type:"", message:""};
    therapeuticAreaService.query().$promise.then(function (resp) {
        $scope.areas = Success.getObject(resp)
    }).catch(function(err){
        $scope.therapeuticAlert.newAlert = true;
        $scope.therapeuticAlert.message = Error.getMessage(err);
        $scope.therapeuticAlert.type = "danger";
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
        $scope.therapeuticAlert.newAlert = true;
        $scope.therapeuticAlert.message = Error.getMessage(err);
        $scope.therapeuticAlert.type = "danger";
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
                $scope.therapeuticAlert.newAlert = true;
                $scope.therapeuticAlert.message = Error.getMessage(err);
                $scope.therapeuticAlert.type = "danger";
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
