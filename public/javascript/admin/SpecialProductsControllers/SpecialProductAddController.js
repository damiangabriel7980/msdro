cloudAdminControllers.controller('SpecialProductAddController', ['$scope', 'SpecialProductsService', 'AmazonService', function($scope, SpecialProductsService, AmazonService) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    //get available groups (a group can have only one special product)
    SpecialProductsService.groupsAvailable.query().$promise.then(function (resp) {
        $scope.groupsAvailable = resp;
    });

    $scope.selectedGroups = [];

    $scope.fileBody = null;

    $scope.fileSelected = function ($files, $event) {
        if($files[0]){
            $scope.fileBody = $files[0];
        }
    };

    $scope.addPage = function () {
        $scope.resetAlert("warning", "Va rugam asteptati...");
        console.log(this);
        SpecialProductsService.products.create({toCreate: $scope.newProductPage}).$promise.then(function (resp) {
            if(resp.error){
                $scope.resetAlert("danger", error.message);
            }else{
                if(!$scope.fileBody){
                    $scope.resetAlert("success", "S-au salvat datele. Nu a fost incarcata o imagine");
                }else{
                    //generate Amazon key
                    var idSaved = resp.justSaved._id;
                    var extension = $scope.fileBody.name.split(".").pop();
                    var key = "productPages/"+idSaved+"/logo/logo."+extension;
                    //upload file
                    AmazonService.uploadFile($scope.fileBody, key, function (err, success) {
                        if(err){
                            $scope.resetAlert("danger", "Datele au fost salvate, dar imaginea nu s-a putut incarca");
                        }else{
                            //update database
                            SpecialProductsService.products.update({id: idSaved}, {logo_path: key}).$promise.then(function (resp) {
                                if(resp.error){
                                    $scope.resetAlert("danger", "Datele au fost salvate, dar imaginea nu s-a putut salva in baza de date");
                                }else{
                                    $scope.resetAlert("success", "Datele au fost salvate. Imaginea a fost salvata");
                                }
                            })
                        }
                    })
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