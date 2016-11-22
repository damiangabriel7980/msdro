controllers.controller('ProductPageMenu', ['$scope', 'SpecialProductsService', 'AmazonService', 'Success', 'tinyMCEConfig', function($scope, SpecialProductsService, AmazonService, Success, tinyMCEConfig) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    var refreshMenuItems = function () {
        SpecialProductsService.menu.query({product_id: $scope.sessionData.idToEdit}).$promise.then(function (resp) {
            $scope.menuItems = Success.getObject(resp);
        });
    };

    refreshMenuItems();

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

    var removeFilesForItem = function (item, callback) {
        //remove all associated images
        AmazonService.deleteFilesAtPath("productPages/"+item.product+"/menu/"+item._id, function (err, count) {
            if(err){
                callback(item._id, null);
            }else{
                callback(null, count);
            }
        });
    };

    $scope.removeItem = function (item) {
        $scope.resetAlert("warning", "Va rugam asteptati...");
        $scope.menuItems = [];
        var filesCount = 0;
        var forRemoval = item.children_ids || [];
        forRemoval.push(item);
        //remove all files
        async.each(forRemoval, function (it, callback) {
            removeFilesForItem(it, function (err, count) {
                if(err){
                    callback(err);
                }else{
                    filesCount += count;
                    callback();
                }
            })
        }, function (err) {
            if(err){
                $scope.resetAlert("Eroare la steregerea imaginilor pentru item-ul cu id "+err);
            }else{
                //remove menu item
                SpecialProductsService.menu.delete({id: item._id}).$promise.then(function (resp) {
                    $scope.resetAlert("success", "Au fost sterse "+filesCount+" imagini. "+ Success.getMessage(resp));
                    refreshMenuItems();
                }).catch(function () {
                    $scope.resetAlert("danger", "Au fost sterse "+filesCount+" imagini, insa a aparut o eroare la stergerea din baza de date");
                });
            }
        })
    };

    $scope.tinymceOptions = tinyMCEConfig.standardConfig();

}]);