controllers.controller('AddPublicContentCategory', ['$scope', '$state', '$modalInstance', 'publicContentService', 'Success', 'Error', function ($scope, $state, $modalInstance, publicContentService,Success,Error) {

    var resetAlert = function (type, text) {
        $scope.alert = {
            show: text?true:false,
            type: type?type:"danger",
            text: text?text:"Unknown error"
        };
    };
    $scope.tinymceOptions = {
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        height: 500,
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

    $scope.addCategory = function () {
        console.log(this.category);
        this.category.last_updated = new Date();
        publicContentService.categories.create(this.category).$promise.then(function (resp) {
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