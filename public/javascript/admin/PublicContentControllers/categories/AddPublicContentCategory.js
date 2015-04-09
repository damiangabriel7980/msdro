controllers.controller('AddPublicContentCategory', ['$scope', '$state', '$modalInstance', 'publicContentService', function ($scope, $state, $modalInstance, publicContentService) {

    var resetAlert = function (type, text) {
        $scope.alert = {
            show: text?true:false,
            type: type?type:"danger",
            text: text?text:"Unknown error"
        };
    };

    $scope.addCategory = function () {
        console.log(this.category);
        publicContentService.categories.create(this.category).$promise.then(function (resp) {
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