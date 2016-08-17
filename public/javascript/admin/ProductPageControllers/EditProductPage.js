controllers.controller('EditProductPage', ['$scope', 'SpecialProductsService', 'AmazonService', 'Success', 'Error', 'PathologiesService', 'Utils', 'tinyMCEConfig', function($scope, SpecialProductsService, AmazonService, Success, Error, PathologiesService, Utils, tinyMCEConfig) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    PathologiesService.pathologies.query().$promise.then(function(result){
        $scope.pathologies = Success.getObject(result);
    });

    SpecialProductsService.products.query({id: $scope.sessionData.idToEdit}).$promise.then(function (resp) {
        resp = Success.getObject(resp);
        $scope.newProductPage = resp.specialProduct;
        $scope.associatedProduct = resp.associatedProduct ? resp.associatedProduct : null;
        $scope.myPathologies.selectedPathologies = $scope.newProductPage.pathologiesID;
        $scope.showTab($scope.newProductPage.productType === 'resource' ? 'prescription' : 'description');
    });

    $scope.myPathologies = {
        selectedPathologies: null
    };

    $scope.productDisplayNames = ["product", "resource"];

    $scope.productTypeDisplayName = function (name) {
        switch (name) {
            case "product":
                return "Produs special";
                break;
            case "resource":
                return "Resursa";
                break;
        }
    };

    $scope.logoImageBody = null;
    $scope.headerImageBody = null;
    $scope.rcpBody = null;

    $scope.fileSelected = function ($files, fileType) {
        if($files[0]){
            switch (fileType) {
                case 'logo':
                    $scope.logoImageBody = $files[0];
                    break;
                case 'header':
                    $scope.headerImageBody = $files[0];
                    break;
                case 'rcp':
                    $scope.rcpBody = $files[0];
                    break;
            }
        }
    };

    $scope.addPage = function (redirectToMenu) {
        $scope.resetAlert("warning", "Va rugam asteptati...");
        var id_pathologies = [];
        for(var j=0;j<$scope.myPathologies.selectedPathologies.length;j++){
            id_pathologies.push($scope.myPathologies.selectedPathologies[j]._id);
        }
        $scope.newProductPage.pathologiesID = id_pathologies;
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
            if($scope.rcpBody){
                extension = $scope.rcpBody.name.split(".").pop();
                var rcpKey =  "productPages/"+$scope.newProductPage._id+"/rcp."+extension;
                if($scope.associatedProduct){
                    var keyAssociated = $scope.associatedProduct.file_path ? $scope.associatedProduct.file_path : "produse/" + $scope.associatedProduct._id + "/rpc/rpc" + $scope.associatedProduct._id + "." + extension;
                    toUpload.push({fileBody: $scope.rcpBody, key: keyAssociated});
                    toUpdate.file_path_prod = keyAssociated;
                    toUpdate.file_key = $scope.associatedProduct._id;
                }
                toUpload.push({fileBody: $scope.rcpBody, key: rcpKey});
                toUpdate.file_path = rcpKey;
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

    $scope.tinymceOptions = tinyMCEConfig.standardConfig();

    $scope.showTab = function (content) {
        $scope.activeTab = content;
    };


}]);