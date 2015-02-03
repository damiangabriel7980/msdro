/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('productsEditCtrl', ['$scope','ProductService','idToEdit','$modalInstance','$state','therapeuticAreaService', function($scope,ProductService,idToEdit,$modalInstance,$state,therapeuticAreaService){
    ProductService.deleteOrUpdateProduct.getProduct({id:idToEdit}).$promise.then(function(result){
        $scope.product=result;
        $scope.selectedAreas = result['therapeutic-areasID'];
        $scope.selectedGroups = result['groupsID'];
    });

    ProductService.getAll.query().$promise.then(function(resp){
        $scope.groups = resp['groups'];
    });

    therapeuticAreaService.query().$promise.then(function (resp) {
        $scope.areas = resp;
    });

    $scope.updateProduct = function(){
        var groups_id = [];
        for(var i=0; i<$scope.selectedGroups.length; i++){
            groups_id.push($scope.selectedGroups[i]._id);
        }
        $scope.product.groupsID = groups_id;
        $scope.product['therapeutic-areasID'] = $scope.returnedAreas;

        ProductService.deleteOrUpdateProduct.update({id:idToEdit},$scope.product).$promise.then(function (resp) {
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
