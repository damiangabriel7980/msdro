/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('EditTherapeuticAreas', ['$scope','$rootScope' ,'areasAdminService','$stateParams','$sce','$filter','$modalInstance','$state','therapeuticAreaService', function($scope,$rootScope,areasAdminService,$stateParams,$sce,$filter,$modalInstance,$state,therapeuticAreaService){
    $scope.therapeuticAlert = {newAlert:false, type:"", message:""};
    $scope.arie = areasAdminService.deleteOrUpdateareas.getArea({id:$stateParams.id}).$promise.then(function(resp){
        $scope.arie = resp['selectedArea'];
        $scope.selectedAreas = resp['childrenAreas'];
        $scope.arie.oldAreas = [];
        if(resp['childrenAreas']){
            for ( var i = 0;i<resp['childrenAreas'].length;i++)
                $scope.arie.oldAreas.push(resp['childrenAreas'][i]);
        }
    });


    $scope.updateArie = function(){
        if($scope.arie && $scope.arie.name!=""){
            $scope.arie['therapeutic-areasID'] = $scope.returnedAreas;
            areasAdminService.deleteOrUpdateareas.update({id:$stateParams.id},$scope.arie).$promise.then(function(resp){
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
    therapeuticAreaService.query().$promise.then(function (resp) {
        $scope.areas = resp;
    });

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        console.log(this);
        $modalInstance.close();
        $state.go('ariiTerapeutice',{},{reload: true});
    };
}]);
