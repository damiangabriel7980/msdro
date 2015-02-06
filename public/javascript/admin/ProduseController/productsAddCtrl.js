/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('productsAddCtrl', ['$scope','$rootScope' ,'ProductService','$stateParams','$sce','$filter','$modalInstance','therapeuticAreaService','$state', function($scope,$rootScope,ProductService,$stateParams,$sce,$filter,$modalInstance,therapeuticAreaService,$state){

    $scope.selectedGroups = [];
    $scope.selectedAreas=[];

    ProductService.getAll.query().$promise.then(function(resp){
        $scope.groups = resp['groups'];
    });

    therapeuticAreaService.query().$promise.then(function (resp) {
        $scope.areas = resp;
    });

    $scope.createProduct=function(){
        var id_groups=[];
        var id_areas=[];
        for(var i=0;i<$scope.selectedGroups.length;i++){
            id_groups.push($scope.selectedGroups[i]._id);
        }

        $scope.newProduct.groupsID=id_groups;
        $scope.newProduct['therapeutic-areasID'] = $scope.returnedAreas;

        ProductService.getAll.save($scope.newProduct).$promise.then(function (resp) {
            console.log(resp);
            $state.reload();
            $modalInstance.close();
        });

    };

    $scope.closeModal = function () {
        $modalInstance.close();
    };

    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };
}]);
