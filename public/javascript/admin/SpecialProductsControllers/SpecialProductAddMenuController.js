cloudAdminControllers.controller('SpecialProductAddMenuController', ['$scope', 'SpecialProductsService', 'AmazonService', function($scope, SpecialProductsService, AmazonService) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    //initialize the new item to add
    $scope.newItem = {};
    //attach current product
    $scope.newItem.product = $scope.sessionData.idToEdit;

    $scope.headerImageBody = null;

    $scope.headerImageSelected = function ($files, $event) {
        if($files[0]){
            $scope.headerImageBody = $files[0];
        }
    };

    $scope.addMenuItem = function () {
        var toAdd = this.newItem;
        async.waterfall([
            function (callback) {
                $scope.resetAlert("warning", "Se adauga meniul...");
                //first, create the menu with no picture added
                SpecialProductsService.menu.create(toAdd).$promise.then(function (resp) {
                    if(resp.error){
                        callback("Eroare la adaugare");
                    }else{
                        //attach to parent if it has one
                        var savedId = resp.saved._id;
                        if($scope.sessionData.parentId){
                            SpecialProductsService.addMenuChild.update({id: $scope.sessionData.parentId}, {child_id: savedId}).$promise.then(function (resp) {
                                if(resp.error){
                                    callback("Eroare la update parinte");
                                }else{
                                    //proceed down the waterfall
                                    callback(null, savedId);
                                }
                            })
                        }else{
                            //proceed down the waterfall
                            callback(null, savedId);
                        }
                    }
                });
            },
            function (menu_id, callback) {
                //upload image and update database
                if($scope.headerImageBody){
                    $scope.resetAlert("warning", "Se incarca imaginea...");
                    var key = "productPages/"+$scope.sessionData.idToEdit+"/menu/"+menu_id+"/header/"+$scope.headerImageBody.name;
                    AmazonService.uploadFile($scope.headerImageBody, key, function (err, success) {
                        if(err){
                            console.log(err);
                            callback("Eroare la adaugarea imaginii");
                        }else{
                            $scope.resetAlert("warning", "Se actualizeaza baza de date...");
                            //update database
                            SpecialProductsService.menu.update({id: menu_id}, {header_image: key}).$promise.then(function (resp) {
                                if(resp.error){
                                    callback("Eroare la update imagine in baza de date");
                                }else{
                                    //proceed down the waterfall
                                    callback(null, menu_id);
                                }
                            });
                        }
                    });
                }else{
                    //proceed down the waterfall
                    callback(null, menu_id);
                }
            }
        ], function (err, menu_id) {
            //waterfall ends here
            if(err){
                $scope.resetAlert("danger", err);
            }else{
                //redirect to edit menu item
                $scope.sessionData.editMenuId = menu_id;
                $scope.renderView("editMenuItem");
            }
        });

    }

}]);