controllers.controller('EditProductPage', ['$scope', 'SpecialProductsService', 'AmazonService', 'Success', 'Error', function($scope, SpecialProductsService, AmazonService, Success, Error) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    SpecialProductsService.products.query({id: $scope.sessionData.idToEdit}).$promise.then(function (resp) {
        resp = Success.getObject(resp);
        $scope.newProductPage = resp[0];
        $scope.selectedGroups = resp[0].groups;
        //get available groups (a group can have only one special product)
        SpecialProductsService.groups.query().$promise.then(function (resp) {
            $scope.groupsAvailable = Success.getObject(resp);
        });
    });

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

    $scope.addPage = function (redirectToMenu) {
        $scope.resetAlert("warning", "Va rugam asteptati...");
        SpecialProductsService.products.update({id: $scope.newProductPage._id}, $scope.newProductPage).$promise.then(function () {
            //generate Amazon keys and extensions for logo and header image
            var extension;
            var toUpload = [];
            var toUpdate = {};
            if($scope.logoImageBody){
                extension = $scope.logoImageBody.name.split(".").pop();
                var logoKey = "productPages/"+$scope.newProductPage._id+"/logo."+extension;
                toUpload.push({fileBody: $scope.logoImageBody, key: logoKey});
                toUpdate.logo_path = logoKey;
            }
            if($scope.headerImageBody){
                extension = $scope.headerImageBody.name.split(".").pop();
                var headerKey = "productPages/"+$scope.newProductPage._id+"/header."+extension;
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
                        SpecialProductsService.products.update({id: $scope.newProductPage._id}, toUpdate).$promise.then(function () {
                            if(redirectToMenu){
                                $scope.renderView("editProductMenu");
                            }else{
                                $scope.closeModal(true);
                            }
                        }).catch(function () {
                            $scope.resetAlert("danger", "Datele au fost salvate, dar a aparut o eroare la salvarea imaginilor in baza de date");
                        });
                    }
                });
            }else{
                if(redirectToMenu){
                    $scope.renderView("editProductMenu");
                }else{
                    $scope.closeModal(true);
                }
            }
        }).catch(function (resp) {
            $scope.resetAlert("danger", Error.getMessage(resp));
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

    $scope.showTab = function (content) {
        $scope.activeTab = content;
    };
    $scope.showTab('description');

}]);