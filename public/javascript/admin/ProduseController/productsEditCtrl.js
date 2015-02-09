/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('productsEditCtrl', ['$scope','ProductService','idToEdit','$modalInstance','$state','therapeuticAreaService','AmazonService','$rootScope', function($scope,ProductService,idToEdit,$modalInstance,$state,therapeuticAreaService,AmazonService,$rootScope){
    $scope.uploadAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlertRPC = {newAlert:false, type:"", message:""};

    ProductService.deleteOrUpdateProduct.getProduct({id:idToEdit}).$promise.then(function(result){
        $scope.product=result;
        $scope.selectedAreas = result['therapeutic-areasID'];
        $scope.selectedGroups = result['groupsID'];
    });

    ProductService.getAll.query().$promise.then(function(resp){
        $scope.groups = resp['groups'];
    });

    therapeuticAreaService.query().$promise.then(function (resp) {
        $scope.areas = resp;
    });

    $scope.updateProduct = function(){
        var groups_id = [];
        for(var i=0; i<$scope.selectedGroups.length; i++){
            groups_id.push($scope.selectedGroups[i]._id);
        }
        $scope.product.groupsID = groups_id;
        $scope.product['therapeutic-areasID'] = $scope.returnedAreas;

        ProductService.deleteOrUpdateProduct.update({id:idToEdit},$scope.product).$promise.then(function (resp) {
            console.log(resp);
            $state.reload();
            $modalInstance.close();
        });
    };
    var putLogoS3 = function (body) {
        AmazonService.getClient(function (s3) {
            var extension = body.name.split('.').pop();
            var key = "produse/"+$scope.product._id+"/image-full/image"+$scope.product._id+"."+extension;
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                if (err) {
                    console.log(err);
                    $scope.uploadAlert.type = "danger";
                    $scope.uploadAlert.message = "Upload esuat!";
                    $scope.uploadAlert.newAlert = true;
                    $scope.$apply();
                } else {
                    //update database as well
                    ProductService.editImage.save({data:{id:$scope.product._id, path:key}}).$promise.then(function (resp) {
                        if(resp.error){
                            $scope.uploadAlert.type = "danger";
                            $scope.uploadAlert.message = "Eroare la actualizarea bazei de date!";
                            $scope.uploadAlert.newAlert = true;
                        }else{
                            $scope.logo = key;
                            $scope.uploadAlert.type = "success";
                            $scope.uploadAlert.message = "Image updated!";
                            $scope.uploadAlert.newAlert = true;
                            console.log("Upload complete");
                            $scope.imagePath = $rootScope.pathAmazonDev+key;
                        }
                    });
                }
            });
            req.on('httpUploadProgress', function (evt) {
                var progress = parseInt(100.0 * evt.loaded / evt.total);
                $scope.$apply(function() {
                    console.log(progress);
                })
            });
        });
    };

    $scope.fileSelected = function($files, $event){
        //make sure group data is loaded. we need to access it to form the amazon key
        //make sure a file was actually loaded
        if($files[0]){
            AmazonService.getClient(function (s3) {
                var key;
                //if there already is a logo, delete it. Then upload new
                if($scope.product.image_path){
                    key =$scope.product.image_path;
                    s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:key}, function (err, data) {
                        if(err){
                            $scope.uploadAlert.type = "danger";
                            $scope.uploadAlert.message = "Eroare la stergerea imaginii vechi!";
                            $scope.uploadAlert.newAlert = true;
                            $scope.$apply();
                        }else{
                            putLogoS3($files[0]);
                        }
                    });
                }else{
                    putLogoS3($files[0]);
                }
            });
        }

    };
    var putRPCS3 = function (body) {
        AmazonService.getClient(function (s3) {
            var extension = body.name.split('.').pop();
            var key = "produse/"+$scope.product._id+"/rpc/rpc"+$scope.product._id+"."+extension;
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                if (err) {
                    console.log(err);
                    $scope.uploadAlertRPC.type = "danger";
                    $scope.uploadAlertRPC.message = "Upload esuat!";
                    $scope.uploadAlertRPC.newAlert = true;
                    $scope.$apply();
                } else {
                    //update database as well
                    ProductService.editRPC.save({data:{id:$scope.product._id, path:key}}).$promise.then(function (resp) {
                        if(resp.error){
                            $scope.uploadAlertRPC.type = "danger";
                            $scope.uploadAlertRPC.message = "Eroare la actualizarea bazei de date!";
                            $scope.uploadAlertRPC.newAlert = true;
                        }else{
                            $scope.logo = key;
                            $scope.uploadAlertRPC.type = "success";
                            $scope.uploadAlertRPC.message = "RPC updated!";
                            $scope.uploadAlertRPC.newAlert = true;
                            console.log("Upload complete");
                            $scope.imagePath = $rootScope.pathAmazonDev+key;
                        }
                    });
                }
            });
            req.on('httpUploadProgress', function (evt) {
                var progress = parseInt(100.0 * evt.loaded / evt.total);
                $scope.$apply(function() {
                    console.log(progress);
                })
            });
        });
    };

    $scope.fileSelectedRPC = function($files, $event){
        //make sure group data is loaded. we need to access it to form the amazon key
        //make sure a file was actually loaded
        if($files[0]){
            AmazonService.getClient(function (s3) {
                var key;
                //if there already is a logo, delete it. Then upload new
                if($scope.product.file_path){
                    key =$scope.product.file_path;
                    s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:key}, function (err, data) {
                        if(err){
                            $scope.uploadAlertRPC.type = "danger";
                            $scope.uploadAlertRPC.message = "Eroare la stergerea RPC-ului vechi!";
                            $scope.uploadAlertRPC.newAlert = true;
                            $scope.$apply();
                        }else{
                            putRPCS3($files[0]);
                        }
                    });
                }else{
                    putRPCS3($files[0]);
                }
            });
        }

    };
    $scope.closeModal = function () {
        $modalInstance.close();
    };

    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

}]);
