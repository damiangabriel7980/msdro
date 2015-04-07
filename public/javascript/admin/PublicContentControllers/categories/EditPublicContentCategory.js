controllers.controller('EditPublicContentCategory', ['$scope', '$state', '$modalInstance', 'publicContentService', 'category', function ($scope, $state, $modalInstance, publicContentService, category) {

    $scope.category = category;

    var resetAlert = function (type, text) {
        $scope.alert = {
            show: text?true:false,
            type: type?type:"danger",
            text: text?text:"Unknown error"
        };
    };

    $scope.editCategory = function () {
        console.log(this.category);
        publicContentService.categories.update({id: this.category._id}, this.category).$promise.then(function (resp) {
            if(resp.error){
                resetAlert("danger", resp.error);
            }else{
                $state.reload();
                $modalInstance.close();
            }
        });
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    }

}]);