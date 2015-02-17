cloudAdminControllers.controller('SpecialProductEditMenuController', ['$scope', 'SpecialProductsService', 'AmazonService', function($scope, SpecialProductsService, AmazonService) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    //get menu info
    SpecialProductsService.menu.query({id: $scope.sessionData.editMenuId}).$promise.then(function (resp) {
        $scope.currentItem = resp.menuItem;
    });

    $scope.headerImageBody = null;

    $scope.headerImageSelected = function ($files, $event) {
        if($files[0]){
            $scope.headerImageBody = $files[0];
        }
    };

    $scope.editMenuItem = function () {
        var toAdd = this.currentItem;
        async.waterfall([
            function (callback) {
                //upload image and update database
                if($scope.headerImageBody){
                    $scope.resetAlert("warning", "Se modifica imaginea...");
                    var extension = $scope.headerImageBody.name.split('.').pop();
                    var key = "productPages/"+$scope.sessionData.idToEdit+"/menu/"+toAdd._id+"/header."+extension;
                    //remove old image
                    AmazonService.deleteFile(toAdd.header_image, function (err, success) {
                        if(err){
                            if(!toAdd.header_image){
                                //ignore error
                            }else{
                                callback("Eroare la stergerea imaginii vechi");
                            }
                        }
                        //upload new image
                        AmazonService.uploadFile($scope.headerImageBody, key, function (err, success) {
                            if(err){
                                console.log(err);
                                callback("Eroare la adaugarea imaginii");
                            }else{
                                //update database key
                                toAdd.header_image = key;
                                callback();
                            }
                        });
                    });
                }else{
                    //proceed down the waterfall
                    callback();
                }
            },
            function (callback) {
                $scope.resetAlert("warning", "Se salveaza datele...");
                //update the menu
                SpecialProductsService.menu.update({id:toAdd._id}, toAdd).$promise.then(function (resp) {
                    if(resp.error){
                        callback("Eroare la salvare");
                    }else{
                        //proceed down the waterfall
                        callback();
                    }
                });
            }
        ], function (err) {
            //waterfall ends here
            if(err){
                $scope.resetAlert("danger", err);
            }else{
                $scope.resetAlert("success", "Datele au fost salvate");
            }
        });
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