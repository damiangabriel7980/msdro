/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('AddTherapeuticAreas', ['$scope','$rootScope' ,'areasAdminService','$stateParams','$sce','$filter','$modalInstance','$state','therapeuticAreaService', function($scope,$rootScope,areasAdminService,$stateParams,$sce,$filter,$modalInstance,$state,therapeuticAreaService){
    $scope.selectedAreas=[];
    $scope.therapeuticAlert = {newAlert:false, type:"", message:""};
    therapeuticAreaService.query().$promise.then(function (resp) {
        $scope.areas = resp;
    });

    $scope.addArie = function(){
        if($scope.arie && $scope.arie.name!=""){
            $scope.arie['therapeutic-areasID'] = $scope.returnedAreas;
            $scope.arie.has_children = false;
            $scope.arie.last_updated = new Date();
            $scope.arie.enabled = true;
            console.log($scope.arie);
            areasAdminService.areas.create({area:$scope.arie}).$promise.then(function(resp){
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
