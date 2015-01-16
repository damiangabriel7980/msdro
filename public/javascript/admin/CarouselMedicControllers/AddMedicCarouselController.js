cloudAdminControllers.controller('AddMedicCarouselController', ['$scope','$rootScope','$sce','CarouselMedicService','$modalInstance', '$state', 'AmazonService', function($scope, $rootScope, $sce, CarouselMedicService, $modalInstance, $state, AmazonService){

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};
    $scope.selectedType = 1;
    $scope.content = {};
    $scope.content.selected = {};

    var fileSelected = null;

    $scope.$watch('selectedType', function (newVal) {
        console.log(newVal);
        //load all contents of this type
        CarouselMedicService.getContentByType.query({type: newVal}).$promise.then(function (resp) {
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
            var extension = fileSelected.name.split('.').pop();

            //form object to add to database
            var toSend = {};
            toSend.title = this.titlu?this.titlu:"";
            toSend.indexNumber = this.ordine?this.ordine:"";
            toSend.type = $scope.selectedType;
            toSend.article_id = $scope.content.selected._id;

            //send data to server
            CarouselMedicService.addImage.save({data: {toAdd: toSend, extension: extension}}).$promise.then(function (resp) {
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
                        var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: resp.key, Body: fileSelected, ACL:'public-read-write'}, function (err, data) {
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