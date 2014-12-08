cloudAdminControllers.controller('AddPublicCarouselController', ['$scope','$rootScope','$sce','CarouselPublicService','$modalInstance', '$state', 'AmazonService', function($scope, $rootScope, $sce, CarouselPublicService, $modalInstance, $state, AmazonService){

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};
    $scope.selectedType = 1;
    $scope.content = {};
    $scope.content.selected = {};

    var fileSelected = null;

    $scope.$watch('selectedType', function (newVal) {
        console.log(newVal);
        //load all contents of this type
        CarouselPublicService.getContentByType.query({type: newVal}).$promise.then(function (resp) {
            $scope.allContent = resp;
            console.log(resp);
        });
    });

    //------------------------------------------------------------------------------------------------- form submission

    $scope.fileSelected = function ($files, $event) {
        fileSelected = $files[0];
    };

    $scope.addImage = function () {
        //check if image was selected
        if(fileSelected){
            //form amazon key
            var extension = fileSelected.name.split('.').pop();
            var key;

            //form object to add to database
            var toSend = {};
            toSend.title = this.titlu?this.titlu:"";
            toSend.description = this.descriere?this.descriere:"";
            toSend.order_index = this.ordine?this.ordine:"";
            toSend.type = $scope.selectedType;
            toSend.content_id = $scope.content.selected._id;
            try{
                key = "generalCarousel/image_"+toSend.content_id+"."+extension;
            }catch(e){
                $scope.uploadAlert.type = "danger";
                $scope.uploadAlert.message = "Selectati un continut!";
                $scope.uploadAlert.newAlert = true;
                return;
            }
            toSend.image_path = key;

            //send data to server
            CarouselPublicService.addImage.save({data: toSend}).$promise.then(function (resp) {
                $scope.statusAlert.newAlert = false;
                $scope.uploadAlert.newAlert = false;
                if(resp.error){
                    $scope.statusAlert.type = "danger";
                    $scope.statusAlert.message = resp.message;
                    $scope.statusAlert.newAlert = true;
                }else{
                    $scope.statusAlert.type = "success";
                    $scope.statusAlert.message = resp.message;
                    $scope.statusAlert.newAlert = true;
                    //upload image to Amazon
                    AmazonService.getClient(function (s3) {
                        var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: fileSelected, ACL:'public-read'}, function (err, data) {
                            if (err) {
                                console.log(err);
                                $scope.uploadAlert.type = "danger";
                                $scope.uploadAlert.message = "Imaginea nu a putut fi incarcata";
                                $scope.uploadAlert.newAlert = true;
                                $scope.$apply();
                            } else {
                                $scope.uploadAlert.type = "success";
                                $scope.uploadAlert.message = "Imaginea a fost incarcata!";
                                $scope.uploadAlert.newAlert = true;
                                $scope.$apply();
                            }
                        });
                        req.on('httpUploadProgress', function (evt) {
                            var progress = parseInt(100.0 * evt.loaded / evt.total);
                            $scope.$apply(function() {
                                console.log(progress);
                            })
                        });
                    });
                }
            });
        }else{
            $scope.statusAlert.type = "danger";
            $scope.statusAlert.message = "Incarcati o imagine";
            $scope.statusAlert.newAlert = true;
        }
    };


    //------------------------------------------------------------------------------------------------ useful functions

    $scope.trustAsHtml = function (val) {
        return $sce.trustAsHtml(val);
    };

    $scope.typeDisplay = function (type) {
        switch(type){
            case 1: return "Stire"; break;
            case 2: return "Articol"; break;
            case 3: return "Elearning"; break;
            case 4: return "Download"; break;
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