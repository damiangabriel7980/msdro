/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('AddProduct', ['$scope','$rootScope' ,'ProductService','$stateParams','$sce','$filter','$modalInstance','therapeuticAreaService','$state', 'Success', 'Error', function($scope,$rootScope,ProductService,$stateParams,$sce,$filter,$modalInstance,therapeuticAreaService,$state,Success, Error){

    $scope.selectedGroups = [];
    $scope.selectedAreas=[];

    ProductService.products.query().$promise.then(function(resp){
        $scope.groups = Success.getObject(resp)['groups'];
    }).catch(function(err){
        console.log(Error.getMessage(err));
    });

    therapeuticAreaService.query().$promise.then(function (resp) {
        $scope.areas = Success.getObject(resp);
    }).catch(function(err){
        console.log(Error.getMessage(err));
    });

    $scope.createProduct=function(){
        var id_groups=[];
        var id_areas=[];
        for(var i=0;i<$scope.selectedGroups.length;i++){
            id_groups.push($scope.selectedGroups[i]._id);
        }

        $scope.newProduct.groupsID = id_groups;
        $scope.newProduct['therapeutic-areasID'] = $scope.returnedAreas;
        $scope.newProduct.last_updated = Date.now();
        $scope.newProduct.enable = true;
        ProductService.products.create({product:$scope.newProduct}).$promise.then(function (resp) {
            $state.reload();
            $modalInstance.close();
        }).catch(function(err){
            console.log(Error.getMessage(err));
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
        height: 500,
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };
}]);
