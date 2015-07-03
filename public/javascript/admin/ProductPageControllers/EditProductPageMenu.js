controllers.controller('EditProductPageMenu', ['$scope', 'SpecialProductsService', 'AmazonService', 'Success', 'Error', function($scope, SpecialProductsService, AmazonService,Success,Error) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    //get menu info
    SpecialProductsService.menu.query({id: $scope.sessionData.editMenuId}).$promise.then(function (resp) {
        $scope.currentItem = Success.getObject(resp).menuItem;
    }).catch(function(err){
        $scope.resetAlert("danger", Error.getMessage(err.data));
    });

    $scope.headerImageBody = null;

    $scope.headerImageSelected = function ($files, $event) {
        if($files[0]){
            $scope.headerImageBody = $files[0];
        }
    };

    $scope.removeHeaderImage = function () {
        $scope.resetAlert("warning", "Se sterge imaginea...");
        SpecialProductsService.menu.update({id: $scope.sessionData.editMenuId}, {header_image: null}).$promise.then(function (resp) {
                if($scope.currentItem.header_image){
                    AmazonService.deleteFile($scope.currentItem.header_image, function (err, success) {
                        if(err){
                            $scope.resetAlert("error", "Eroare la stergerea imaginii");
                        }else{
                            $scope.headerImageBody = null;
                            $scope.currentItem.header_image = null;
                            $scope.resetAlert("success", "Imaginea a fost stearsa");
                            $scope.$apply();
                        }
                    });
                }else{
                    $scope.headerImageBody = null;
                    $scope.resetAlert("success", "Imaginea a fost stearsa");
                }
        }).catch(function(err){
            $scope.resetAlert("danger", Error.getMessage(err.data));
        });
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
                            callback("Eroare la stergerea imaginii vechi");
                        }
                        //upload new image
                        AmazonService.uploadFile($scope.headerImageBody, key, function (err, success) {
                            if(err){
                                console.log(err);
                                callback("Eroare la adaugarea imaginii");
                            }else{
                                //update scope and database keys
                                $scope.currentItem.header_image = key;
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
                        //proceed down the waterfall
                        callback();
                }).catch(function(err){
                    callback("Eroare la salvare");
                    $scope.resetAlert("danger", Error.getMessage(err.data));
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
        height: 500,
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

}]);