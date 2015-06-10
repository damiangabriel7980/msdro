/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('AddTherapeuticAreas', ['$scope','$rootScope' ,'areasAdminService','$stateParams','$sce','$filter','$modalInstance','$state','therapeuticAreaService', function($scope,$rootScope,areasAdminService,$stateParams,$sce,$filter,$modalInstance,$state,therapeuticAreaService){
    $scope.selectedAreas=[];
    therapeuticAreaService.query().$promise.then(function (resp) {
        $scope.areas = resp;
    });
    $scope.arie={
        has_children: false,
        last_updated: new Date(),
        name: "",
        enabled:true,
        "therapeutic-areasID": []
    };

    $scope.addArie = function(){
        if($scope.arie){
            $scope.arie['therapeutic-areasID'] = $scope.returnedAreas;
            areasAdminService.getAll.save($scope.arie).$promise.then(function(resp){
                $scope.arie = {};
                $modalInstance.close();
                $state.go('ariiTerapeutice',{},{reload: true});
            });
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
