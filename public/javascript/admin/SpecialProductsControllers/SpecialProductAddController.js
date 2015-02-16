cloudAdminControllers.controller('SpecialProductAddController', ['$scope', 'SpecialProductsService', 'AmazonService', function($scope, SpecialProductsService, AmazonService) {

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
        console.log(this);
        SpecialProductsService.products.create({toCreate: $scope.newProductPage}).$promise.then(function (resp) {
            if(resp.error){
                $scope.resetAlert("danger", error.message);
            }else{
                if(!$scope.logoImageBody){
                    $scope.resetAlert("success", "S-au salvat datele. Nu a fost incarcata o imagine");
                }else{
                    var idSaved = resp.justSaved._id;
                    //generate Amazon keys and extensions for logo and header image
                    var extension = $scope.logoImageBody.name.split(".").pop();
                    var logoKey = "productPages/"+idSaved+"/logo."+extension;
                    extension = $scope.headerImageBody.name.split(".").pop();
                    var headerKey = "productPages/"+idSaved+"/header."+extension;
                    //upload file
                    $scope.resetAlert("warning", "Se incarca imaginile...");
                    AmazonService.uploadFiles([
                        {fileBody: $scope.logoImageBody, key: logoKey},
                        {fileBody: $scope.headerImageBody, key: headerKey}
                    ], function (err, success) {
                        if(err){
                            $scope.resetAlert("danger", "Datele au fost salvate, dar a aparut o eroare la incarcarea imaginilor");
                        }else{
                            //update database
                            SpecialProductsService.products.update({id: idSaved}, {logo_path: logoKey, header_image: headerKey}).$promise.then(function (resp) {
                                if(resp.error){
                                    $scope.resetAlert("danger", "Datele au fost salvate, dar a aparut o eroare la salvarea imaginilor in baza de date");
                                }else{
                                    $scope.resetAlert("success", "Datele au fost salvate. Imaginile au fost salvate");
                                }
                            })
                        }
                    });
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