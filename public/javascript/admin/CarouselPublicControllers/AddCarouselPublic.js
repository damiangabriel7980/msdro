controllers.controller('AddCarouselPublic', ['$scope','$rootScope','$sce','CarouselPublicService','$modalInstance', '$state', 'AmazonService', 'Success', 'Error', function($scope, $rootScope, $sce, CarouselPublicService, $modalInstance, $state, AmazonService, Success,Error){

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};
    $scope.selectedType = 1;
    $scope.content = {};
    $scope.content.selected = {};

    var fileSelected = null;

    $scope.$watch('selectedType', function (newVal) {
        //load all contents of this type
        CarouselPublicService.attachedContent.query({type: newVal}).$promise.then(function (resp) {
            $scope.allContent = Success.getObject(resp);
        }).catch(function(err){
            $scope.statusAlert.type = "danger";
            $scope.statusAlert.message = Error.getMessage(err.data);
            $scope.statusAlert.newAlert = true;
        });
    });

    //------------------------------------------------------------------------------------------------- form submission

    $scope.fileSelected = function ($files, $event) {
        fileSelected = $files[0];
    };

    $scope.addImage = function () {
        //check if image was selected
        if(fileSelected){
            var extension = fileSelected.name.split('.').pop();
            //var toSend = {};
            this.carouselImage.type = $scope.selectedType;
            this.carouselImage.content_id = $scope.content.selected._id;
            this.carouselImage.enable = false;
            this.carouselImage.last_updated = new Date();
            //send data to server
            CarouselPublicService.carouselPublic.create({data: {toAdd: this.carouselImage, extension: extension}}).$promise.then(function (resp) {
                $scope.statusAlert.newAlert = false;
                $scope.uploadAlert.newAlert = false;
                    $scope.statusAlert.type = "success";
                    $scope.statusAlert.message = Success.getMessage(resp);
                    $scope.statusAlert.newAlert = true;
                    //upload image to Amazon
                    AmazonService.getClient(function (s3) {
                        var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: resp.success.key, Body: fileSelected, ACL:'public-read'}, function (err, data) {
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
            }).catch(function(err){
                $scope.statusAlert.type = "danger";
                $scope.statusAlert.message = Error.getMessage(err.data);
                $scope.statusAlert.newAlert = true;
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