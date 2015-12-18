/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('EditProduct', ['$scope','ProductService','idToEdit','$modalInstance','$state','therapeuticAreaService','AmazonService','$rootScope', 'GroupsService', 'Success', 'Error','ProductQrService', function($scope,ProductService,idToEdit,$modalInstance,$state,therapeuticAreaService,AmazonService,$rootScope,GroupsService,Success,Error,ProductQrService){
    $scope.uploadAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlertRPC = {newAlert:false, type:"", message:""};
    $scope.idToEdit = idToEdit;
    var QRpath = 'produse/'+$scope.idToEdit+'/QR/qr.png';


    ProductService.products.query({id:idToEdit}).$promise.then(function(result){
        $scope.product=Success.getObject(result);
        $scope.selectedAreas = Success.getObject(result)['therapeutic-areasID'];
        $scope.selectedGroups = Success.getObject(result)['groupsID'];
    }).catch(function(err){
        console.log(Error.getMessage(err));
    });

    GroupsService.groups.query().$promise.then(function(resp){
        $scope.groups = Success.getObject(resp);
    }).catch(function(err){
        console.log(Error.getMessage(err));
    });

    therapeuticAreaService.query().$promise.then(function (resp) {
        $scope.areas = Success.getObject(resp);
    }).catch(function(err){
        console.log(Error.getMessage(err));
    });

    $scope.updateProduct = function(){
        var groups_id = [];
        for(var i=0; i<$scope.selectedGroups.length; i++){
            groups_id.push($scope.selectedGroups[i]._id);
        }
        $scope.product.groupsID = groups_id;
        $scope.product['therapeutic-areasID'] = $scope.returnedAreas;
        $scope.product.last_updated = Date.now();

        ProductService.products.update({id:idToEdit},{product:$scope.product}).$promise.then(function (resp) {
            console.log(resp);
            $state.reload();
            $modalInstance.close();
        }).catch(function(err){
            console.log(Error.getMessage(err));
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
                    ProductService.products.update({id:$scope.product._id},{info:{path:key,logo:true}}).$promise.then(function (resp) {
                            $scope.logo = key;
                            $scope.uploadAlert.type = "success";
                            $scope.uploadAlert.message = "Image updated!";
                            $scope.uploadAlert.newAlert = true;
                            console.log("Upload complete");
                            $scope.imagePath = $rootScope.pathAmazonDev+key;
                    }).catch(function(err){
                        $scope.uploadAlert.type = "danger";
                        $scope.uploadAlert.message = Error.getMessage(err);
                        $scope.uploadAlert.newAlert = true;
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
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read',ContentType: body.type}, function (err, data) {
                if (err) {
                    console.log(err);
                    $scope.uploadAlertRPC.type = "danger";
                    $scope.uploadAlertRPC.message = "Upload esuat!";
                    $scope.uploadAlertRPC.newAlert = true;
                    $scope.$apply();
                } else {
                    //update database as well
                    ProductService.products.update({id:$scope.product._id},{info:{path:key,rpc:true}}).$promise.then(function (resp) {
                            $scope.logo = key;
                            $scope.uploadAlertRPC.type = "success";
                            $scope.uploadAlertRPC.message = "RPC updated!";
                            $scope.uploadAlertRPC.newAlert = true;
                            console.log("Upload complete");
                            $scope.imagePath = $rootScope.pathAmazonDev+key;
                    }).catch(function(err){
                        $scope.uploadAlert.type = "danger";
                        $scope.uploadAlert.message = Error.getMessage(err);
                        $scope.uploadAlert.newAlert = true;
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


    var updateProduct = function(){
      var toUpdate = {};
      angular.copy($scope.product,toUpdate);
      delete toUpdate['groupsID'];
      delete toUpdate['_id'];
      delete toUpdate['therapeutic-areasID'];
      toUpdate.last_updated = new Date();

      ProductService.products.update({id:$scope.product._id},{product:toUpdate}).$promise.then(function(resp){
        $scope.uploadAlert = {newAlert:false, type:"", message:""};
      }).catch(function(err){
        console.log(err);
      });
    };
    $scope.onMainImageUpdate = function(key){
      $scope.product.mainImageUrl = $rootScope.pathAmazonDev+key.replace(/\s+/g, '%20');
      updateProduct();
    };
    $scope.onImagesUpdate = function(key){
      var newImageUrl = $rootScope.pathAmazonDev+key.replace(/\s+/g, '%20');
      $scope.product.imageUrls.push(newImageUrl);
      updateProduct();
    };
    $scope.onVideosUpdate = function(key){
      var newVideoUrl = $rootScope.pathAmazonDev+key.replace(/\s+/g, '%20');
      $scope.product.videoUrls.push(newVideoUrl);
      updateProduct();
    };
    $scope.onVideosDelete = function(key){
      var position = $scope.product.videoUrls.indexOf(key.replace(/\s+/g, '%20'));
      $scope.product.videoUrls.splice(position,1);
      updateProduct();
    };
    $scope.onImagesDelete = function(key){
      var position = $scope.product.imageUrls.indexOf(key.replace(/\s+/g, '%20'));
      $scope.product.imageUrls.splice(position,1);
      updateProduct();

    };
    $scope.onMainImageDelete = function(key){
      $scope.product.mainImageUrl="";
      updateProduct();
    };
    var getBase64QrImage = function(){
      var qrContainer = document.getElementById("qrCodeContainer");
      var qrImg = qrContainer.getElementsByTagName('img')[0];
      var base64ImageString = qrImg.currentSrc;
      return base64ImageString;
    };

    var generateGUID = function(){
     var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = crypto.getRandomValues(new Uint8Array(1))[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
                });
        return guid;
    };

    $scope.generateQr= function(){
      var qr = generateGUID();

      $scope.uploadAlert = {
        newAlert:true,
        type:'alert',
        message:'Se genereaza QR-ul'
      };
        
      $scope.product.codeQR = qr;

      var imageString = getBase64QrImage();

      ProductQrService.qr.update({},{base64Image:imageString,path:QRpath}).$promise.then(function(resp){
          $scope.uploadAlert = {
              newAlert:true,
              type:'alert',
              message:'Se salveaza codul QR'
          };
      updateProduct();
      }).catch(function(err){
        console.log(err);
      })
    };




    $scope.closeModal = function () {
        $modalInstance.close();
        $state.reload();
    };

    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        height: 500,
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

}]);
