controllers.controller('EditCarouselPublic', ['$scope', '$rootScope', '$sce', 'CarouselPublicService', '$modalInstance', '$state', 'idToEdit', 'AmazonService', 'Success', 'Error', function($scope, $rootScope, $sce, CarouselPublicService, $modalInstance, $state, idToEdit, AmazonService,Success,Error){

    //init variables
    $scope.toEdit = {};

    $scope.selectedContent = {};

    $scope.linkNames = ["content", "url", null];

    //------------------------------------------------------------------------------------------------ get current data

    //get carousel image
    CarouselPublicService.carouselPublic.query({id: idToEdit}).$promise.then(function (resp) {
        var image = Success.getObject(resp);
        if(image.links){
            if(image.links.content){
                $scope.selectedContent = {
                    _id: image.links.content._id,
                    title: image.links.content.title
                };
                $scope.contentType = image.links.content.type;
            }
        }
        $scope.toEdit = image;
        //console.log($scope.toEdit);
        $scope.$applyAsync();
    }).catch(function(err){
        $scope.resetAlert(Error.getMessage(err));
    });

    //------------------------------------------------------------------------------------------------- form submission

    //change database info
    $scope.editImage = function () {
        var image = this.toEdit;
        //console.log(image);
        if(!image.links) image.links = {};
        image.links.content = this.selectedContent._id;
        $scope.toEdit.last_updated = new Date();
        CarouselPublicService.carouselPublic.update({id: image._id}, image).$promise.then(function (resp) {
            $scope.resetAlert(Success.getMessage(resp), "success");
        }).catch(function(err){
            $scope.resetAlert(Error.getMessage(err));
        });
    };

    //change amazon image
    $scope.fileSelected = function ($files, $event) {
        if($files && $files[0]){
            $scope.resetAlert("Se incarca...", "warning");

            var extension = $files[0].name.split('.').pop();
            var key = "generalCarousel/image_" + $scope.toEdit._id + "." + extension;
            //if there already is an image, delete it. Then upload new
            if($scope.toEdit.image_path){
                AmazonService.deleteFile($scope.toEdit.image_path, function (err) {
                    if(err){
                        $scope.resetAlert("Eroare la stergerea imaginii vechi!");
                    }else{
                        putFile($files[0], key);
                    }
                });
            }else{
                putFile($files[0], key);
            }
        }
    };

    //------------------------------------------------------------------------------------------------ useful functions

    var putFile = function (body, key) {
        AmazonService.uploadFile(body, key, function (err) {
            if (err) {
                $scope.resetAlert("Upload esuat!");
                console.log(err);
            } else {
                CarouselPublicService.carouselPublic.update({id: $scope.toEdit._id}, {image_path: key}).$promise.then(function(){
                    $scope.toEdit.image_path = key;
                    $scope.resetAlert("Upload reusit!", "success");
                }).catch(function(err){
                    $scope.resetAlert(Error.getMessage(err));
                });
            }
        });
    };

    $scope.resetAlert = function (message, type) {
        $scope.statusAlert = {
            message: message,
            type: type || "danger",
            show: message
        };
    };
    $scope.resetAlert();

    $scope.selectContentType = function (type) {
        $scope.selectedContent = {};
        getContent(type);
    };

    var getContent = function (type) {
        CarouselPublicService.attachedContent.query({type: type}).$promise.then(function (resp) {
            $scope.allContent = Success.getObject(resp);
            if($scope.toEdit.links && $scope.toEdit.links.content){
                var poz = findInContent($scope.toEdit.links.content._id);
                if(poz > -1){
                    if($scope.allContent[poz].type === type){
                        $scope.selectedContent = {
                            _id: $scope.allContent[poz]._id,
                            title: $scope.allContent[poz].title
                        };
                    }
                }
            }
        }).catch(function(err){
            $scope.resetAlert(Error.getMessage(err));
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

    $scope.linkNameDisplay = function (name) {
        switch(name){
            case "content": return "Continut"; break;
            case "url": return "URL"; break;
            default: return "Fara legatura"; break;
        }
    };

    $scope.contentTypeDisplay = function (type) {
        switch(type){
            case 1: return "Stire"; break;
            case 2: return "Articol"; break;
            case 3: return "Elearning"; break;
            case 4: return "Download"; break;
            default: return "Necunoscut"; break;
        }
    };

    $scope.currentDate = function () {
        return new Date();
    };

    $scope.closeModal = function(){
        $modalInstance.close();
        $state.reload();
    }

}]);