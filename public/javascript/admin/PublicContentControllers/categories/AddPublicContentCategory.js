controllers.controller('AddPublicContentCategory', ['$scope', '$state', '$modalInstance', 'publicContentService', 'Success', 'Error', function ($scope, $state, $modalInstance, publicContentService,Success,Error) {

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
                $state.reload();
                $modalInstance.close();
        }).catch(function(err){
            resetAlert("danger", Error.getMessage(err.data));
        });
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    }

}]);