cloudAdminControllers.controller('SpecialProductMenuController', ['$scope', 'SpecialProductsService', 'AmazonService', function($scope, SpecialProductsService, AmazonService) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    SpecialProductsService.menu.query({product_id: $scope.sessionData.idToEdit}).$promise.then(function (resp) {
        console.log(resp);
        $scope.menuItems = resp.menuItems;
    });

    $scope.addParent = function () {
        $scope.sessionData.parentId = null;
        $scope.renderView("addMenuItem");
    };

    $scope.addChild = function (parentId) {
        $scope.sessionData.parentId = parentId;
        $scope.renderView("addMenuItem");
    };

    $scope.editItem = function (id) {
        console.log(id);
        $scope.sessionData.editMenuId = id;
        $scope.renderView("editMenuItem");
    };

    $scope.removeItem = function (id) {
        console.log(id);
    };

    $scope.tinymceOptions = {
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

}]);