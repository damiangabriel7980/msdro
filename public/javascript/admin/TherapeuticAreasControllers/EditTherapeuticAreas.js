/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('EditTherapeuticAreas', ['$scope','$rootScope' ,'areasAdminService','$stateParams','$sce','$filter','$modalInstance','$state','therapeuticAreaService', function($scope,$rootScope,areasAdminService,$stateParams,$sce,$filter,$modalInstance,$state,therapeuticAreaService){

    $scope.arie = areasAdminService.deleteOrUpdateareas.getArea({id:$stateParams.id}).$promise.then(function(resp){
        $scope.arie = resp['selectedArea'];
        $scope.selectedAreas = resp['childrenAreas'];
    });


    $scope.updateArie = function(){
        if($scope.arie){
            $scope.arie['therapeutic-areasID'] = $scope.returnedAreas;
            areasAdminService.deleteOrUpdateareas.update({id:$stateParams.id},$scope.arie).$promise.then(function(resp){
                $scope.arie = {};
                $modalInstance.close();
                $state.go('ariiTerapeutice',{},{reload: true});
            });
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
