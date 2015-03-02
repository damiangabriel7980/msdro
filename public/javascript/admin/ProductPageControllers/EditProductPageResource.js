controllers.controller('EditProductPageResource', ['$scope', 'SpecialProductsService', 'AmazonService','$timeout', function($scope, SpecialProductsService, AmazonService,$timeout) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    $scope.resourceFileBody = null;
    $scope.currentItem = $scope.sessionData.resourceToEdit;

    $scope.resourceFileSelected = function ($files, $event) {
        if($files[0] && $files[0].type=="application/pdf"){
            $scope.resourceFileBody = $files[0];
            $scope.currentItem.size = Math.round($files[0].size / 1024)+" KB";
            $scope.currentItem.type = $files[0].name.split('.').pop().toUpperCase();
            console.log($files[0]);
        }
        else
        {
            $scope.resetAlert("danger","Resource must be a pdf file!");
            $timeout(function(){
                $scope.resetAlert();
            },3000)
        }
    };

    $scope.editResource = function () {
        if(!$scope.currentItem._id){

        }else{
            $scope.resetAlert("warning", "Va rugam asteptati");
            var amazonKey;
            async.waterfall([
                function (callback) {
                    //delete old file if it's the case
                    if($scope.resourceFileBody && $scope.currentItem.file_path){
                        $scope.resetAlert("warning", "Se sterge fisierul vechi...");
                        AmazonService.deleteFile($scope.currentItem.file_path, function (err, success) {
                            if(err){
                                callback("Eroare la stergerea fisierului vechi");
                            }else{
                                callback()
                            }
                        });
                    }else{
                        callback();
                    }
                },
                function (callback) {
                    //upload new file if there is one
                    if($scope.resourceFileBody){
                        $scope.resetAlert("warning", "Se incarca fisierul nou...");
                        var ext = $scope.resourceFileBody.name.split('.').pop();
                        amazonKey = "productPages/"+$scope.sessionData.idToEdit+"/downloads/"+$scope.currentItem._id+"/"+$scope.resourceFileBody.name;
                        console.log(amazonKey);
                        AmazonService.uploadFile($scope.resourceFileBody, amazonKey, function (err, success) {
                            if(err){
                                callback("Eroare la incarcarea fisierului");
                            }else{
                                $scope.currentItem.file_path = amazonKey;
                                callback();
                            }
                        });
                    }else{
                        callback();
                    }
                },
                function (callback) {
                    //upload document
                    $scope.resetAlert("warning", "Se actualizeaza baza de date...");
                    SpecialProductsService.resources.update({id: $scope.currentItem._id}, $scope.currentItem).$promise.then(function (resp) {
                        if(resp.error){
                            callback(resp.message, null);
                        }else{
                            callback(null, resp.message);
                        }
                    });
                }
            ], function (err, success) {
                if(err){
                    $scope.resetAlert("danger", err);
                }else{
                    $scope.resetAlert("success", success);
                }
            });

        }
    }

}]);