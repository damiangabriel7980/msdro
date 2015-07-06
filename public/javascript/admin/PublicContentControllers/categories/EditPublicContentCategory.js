controllers.controller('EditPublicContentCategory', ['$scope', '$state', '$modalInstance', 'publicContentService', 'category', 'Success', 'Error', function ($scope, $state, $modalInstance, publicContentService, category, Success, Error) {

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
                $state.reload();
                $modalInstance.close();
        }).catch(function(err){
            resetAlert("danger", Error.getMessage(err));
        });
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    }

}]);