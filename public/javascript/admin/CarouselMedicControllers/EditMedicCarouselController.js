cloudAdminControllers.controller('EditMedicCarouselController', ['$scope', '$rootScope', '$sce', 'CarouselMedicService', '$modalInstance', '$state', 'idToEdit', 'AmazonService', function($scope, $rootScope, $sce, CarouselMedicService, $modalInstance, $state, idToEdit, AmazonService){

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};

    $scope.toEdit = {};

    $scope.content = {};
    $scope.content.selected = {};

    $scope.$watch('toEdit.type', function (newVal) {
        console.log(newVal);
        //load all contents of this type
        if(newVal){
            CarouselMedicService.getContentByType.query({type: newVal}).$promise.then(function (resp) {
                $scope.allContent = resp;
                if($scope.toEdit.article_id){
                    var poz = findInContent($scope.toEdit.article_id);
                    if(poz > -1){
                        if($scope.allContent[poz].type === newVal){
                            $scope.content.selected._id = $scope.allContent[poz]._id;
                            $scope.content.selected.title = $scope.allContent[poz].title;
                            console.log($scope.content.selected);
                        }else{
                            $scope.content.selected._id = null;
                            $scope.content.selected.title = null;
                        }
                    }else{
                        $scope.content.selected._id = null;
                        $scope.content.selected.title = null;
                    }
                }
            });
        }
    });

    //------------------------------------------------------------------------------------------------ get current data

    CarouselMedicService.getById.query({id: idToEdit}).$promise.then(function (resp) {
        console.log(resp);
        $scope.toEdit = resp;
    });

    //------------------------------------------------------------------------------------------------- form submission

    //change amazon image
    $scope.fileSelected = function ($files, $event) {
        if($files[0]){
            $scope.uploadAlert.type = "warning";
            $scope.uploadAlert.message = "Se incarca...";
            $scope.uploadAlert.newAlert = true;
            $scope.$apply();

            var extension = $files[0].name.split('.').pop();
            var key = "carousel/medic/image_"+idToEdit+"."+extension;
            //if there already is an image, delete it. Then upload new
            if($scope.toEdit.image_path){
                AmazonService.getClient(function (s3) {
                    s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:$scope.toEdit.image_path}, function (err, data) {
                        if(err){
                            $scope.uploadAlert.type = "danger";
                            $scope.uploadAlert.message = "Eroare la stergerea imaginii vechi!";
                            $scope.uploadAlert.newAlert = true;
                            $scope.$apply();
                        }else{
                            putFile($files[0], key);
                        }
                    });
                });
            }else{
                putFile($files[0], key);
            }
        }
    };

    //change database info
    $scope.editImage = function () {
        //get selected content id
        $scope.toEdit.article_id = $scope.content.selected._id;
        console.log($scope.toEdit);
        CarouselMedicService.editImage.save({data: {toUpdate: $scope.toEdit, id: idToEdit}}).$promise.then(function (resp) {
            if(resp.error){
                $scope.statusAlert.type = "danger";
            }else{
                $scope.statusAlert.type = "success";
            }
            $scope.statusAlert.message = resp.message;
            $scope.statusAlert.newAlert = true;
        });
    };


    //------------------------------------------------------------------------------------------------ useful functions

    var putFile = function (body, key) {
        AmazonService.getClient(function (s3) {
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                if (err) {
                    console.log(err);
                    $scope.uploadAlert.type = "danger";
                    $scope.uploadAlert.message = "Upload esuat!";
                    $scope.uploadAlert.newAlert = true;
                    $scope.$apply();
                } else {
                    $scope.uploadAlert.type = "success";
                    $scope.uploadAlert.message = "Upload reusit!";
                    $scope.uploadAlert.newAlert = true;
                    $scope.$apply();
                    console.log("Upload complete");
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

    var findInContent = function(id){
        for(var i=0; i<$scope.allContent.length; i++){
            if($scope.allContent[i]._id === id) return i;
        }
        return -1;
    };

    $scope.trustAsHtml = function (val) {
        return $sce.trustAsHtml(val);
    };

    $scope.typeDisplay = function (type) {
        switch(type){
            case 1: return "Stire"; break;
            case 2: return "Stire legislativa"; break;
            case 3: return "Stire stiintifica"; break;
            default: return "Necunoscut"; break;
        }
    };

    $scope.closeModal = function(){
        $modalInstance.close();
        $state.reload();
    }

}]).filter('propsFilter', function() {
    //used for select2
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
});