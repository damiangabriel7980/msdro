cloudAdminControllers.controller('SpecialProductEditMenuController', ['$scope', 'SpecialProductsService', 'AmazonService', function($scope, SpecialProductsService, AmazonService) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    //get menu info
    SpecialProductsService.menu.query({id: $scope.sessionData.editMenuId}).$promise.then(function (resp) {
        $scope.currentItem = resp.menuItem;
    });

    $scope.headerImageBody = null;

    $scope.tinymceOptions = {
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

}]);