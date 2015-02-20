controllers.controller('AddProductPage', ['$scope', 'SpecialProductsService', 'AmazonService', function($scope, SpecialProductsService, AmazonService) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    //get available groups (a group can have only one special product)
    SpecialProductsService.groupsAvailable.query().$promise.then(function (resp) {
        $scope.groupsAvailable = resp;
    });

    $scope.selectedGroups = [];

    $scope.logoImageBody = null;
    $scope.headerImageBody = null;

    $scope.logoSelected = function ($files, $event) {
        if($files[0]){
            $scope.logoImageBody = $files[0];
        }
    };

    $scope.headerSelected = function ($files, $event) {
        if($files[0]){
            $scope.headerImageBody = $files[0];
        }
    };

    $scope.addPage = function () {
        $scope.resetAlert("warning", "Va rugam asteptati...");
        SpecialProductsService.products.create({toCreate: $scope.newProductPage}).$promise.then(function (resp) {
            if(resp.error){
                $scope.resetAlert("danger", error.message);
            }else{
                var idSaved = resp.justSaved._id;
                //generate Amazon keys and extensions for logo and header image
                var extension;
                var toUpload = [];
                var toUpdate = {};
                if($scope.logoImageBody){
                    extension = $scope.logoImageBody.name.split(".").pop();
                    var logoKey = "productPages/"+idSaved+"/logo."+extension;
                    toUpload.push({fileBody: $scope.logoImageBody, key: logoKey});
                    toUpdate.logo_path = logoKey;
                }
                if($scope.headerImageBody){
                    extension = $scope.headerImageBody.name.split(".").pop();
                    var headerKey = "productPages/"+idSaved+"/header."+extension;
                    toUpload.push({fileBody: $scope.headerImageBody, key: headerKey});
                    toUpdate.header_image = headerKey;
                }
                //upload files
                if(toUpload.length > 0){
                    $scope.resetAlert("warning", "Se incarca imaginile...");
                    AmazonService.uploadFiles(toUpload, function (err, success) {
                        if(err){
                            $scope.resetAlert("danger", "Datele au fost salvate, dar a aparut o eroare la incarcarea imaginilor");
                        }else{
                            //update database
                            SpecialProductsService.products.update({id: idSaved}, toUpdate).$promise.then(function (resp) {
                                if(resp.error){
                                    $scope.resetAlert("danger", "Datele au fost salvate, dar a aparut o eroare la salvarea imaginilor in baza de date");
                                }else{
                                    $scope.setSessionData({idToEdit: idSaved});
                                    $scope.renderView('specialProductEdit');
                                }
                            })
                        }
                    });
                }else{
                    $scope.setSessionData({idToEdit: idSaved});
                    $scope.renderView('specialProductEdit');
                }
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