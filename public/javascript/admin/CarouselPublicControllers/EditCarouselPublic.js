controllers.controller('EditCarouselPublic', ['$scope', '$rootScope', '$sce', 'CarouselPublicService', 'publicContentService', '$modalInstance', '$state', 'idToEdit', 'AmazonService', 'Success', 'Error', function($scope, $rootScope, $sce, CarouselPublicService, publicContentService, $modalInstance, $state, idToEdit, AmazonService,Success,Error){

    //init variables
    $scope.toEdit = {};

    $scope.content = {};
    $scope.content.selected = {};

    $scope.linkNames = ["content", "category", "url"];

    //------------------------------------------------------------------------------------------------ get current data

    //get carousel image
    CarouselPublicService.carouselPublic.query({id: idToEdit}).$promise.then(function (resp) {
        var image = Success.getObject(resp);
        if(image.links){
            if(image.links.content){
                $scope.content.selected = {
                    _id: image.links.content._id,
                    title: image.links.content.title
                };
                $scope.contentType = image.links.content.type;
            }
            if(image.links.category){
                image.links.category = image.links.category._id;
            }
        }
        $scope.toEdit = image;
        //console.log($scope.toEdit);
    }).catch(function(err){
        $scope.resetAlert(Error.getMessage(err));
    });
    
    //get categories
    publicContentService.categories.query({}).$promise.then(function (resp) {
        $scope.categories = Success.getObject(resp);
        //console.log($scope.categories);
    });

    //------------------------------------------------------------------------------------------------- form submission

    //change database info
    $scope.editImage = function () {
        var image = this.toEdit;
        console.log(image);
        if(!image.links) image.links = {};
        image.links.content = this.content.selected._id;
        $scope.toEdit.last_updated = new Date();
        CarouselPublicService.carouselPublic.update({id: image._id}, image).$promise.then(function (resp) {
            $scope.resetAlert(Success.getMessage(resp), "success");
        }).catch(function(err){
            $scope.resetAlert(Error.getMessage(err));
        });
    };

    //change amazon image
    $scope.fileSelected = function ($files, $event) {
        if($files[0]){
            $scope.resetAlert("Se incarca...", "warning");
            $scope.$apply();

            var extension = $files[0].name.split('.').pop();
            var key = "generalCarousel/image_"+idToEdit+"."+extension;
            //if there already is an image, delete it. Then upload new
            if($scope.toEdit.image_path){
                AmazonService.getClient(function (s3) {
                    s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:$scope.toEdit.image_path}, function (err, data) {
                        if(err){
                            $scope.resetAlert("Eroare la stergerea imaginii vechi!");
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


    //------------------------------------------------------------------------------------------------ useful functions

    $scope.resetAlert = function (message, type) {
        $scope.statusAlert = {
            message: message,
            type: type || "danger",
            show: message
        };
    };
    $scope.resetAlert();

    $scope.selectContentType = function (type) {
        $scope.content.selected = {};
        getContent(type);
    };

    var getContent = function (type) {
        CarouselPublicService.attachedContent.query({type: type}).$promise.then(function (resp) {
            $scope.allContent = Success.getObject(resp);
            if($scope.toEdit.links && $scope.toEdit.links.content){
                var poz = findInContent($scope.toEdit.links.content._id);
                if(poz > -1){
                    if($scope.allContent[poz].type === type){
                        $scope.content.selected = {
                            _id: $scope.allContent[poz]._id,
                            title: $scope.allContent[poz].title
                        };
                        console.log($scope.content.selected);
                    }
                }
            }
        }).catch(function(err){
            $scope.resetAlert(Error.getMessage(err));
        });
    };

    var putFile = function (body, key) {
        AmazonService.getClient(function (s3) {
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                if (err) {
                    $scope.resetAlert("Upload esuat!");
                    console.log(err);
                    $scope.$apply();
                } else {
                    CarouselPublicService.carouselPublic.update({id: idToEdit},{data: {imagePath: key}}).$promise.then(function(resp){
                        $scope.resetAlert("Upload reusit!", "success");
                        $scope.$apply();
                        console.log("Upload complete");
                    }).catch(function(err){
                        $scope.resetAlert(Error.getMessage(err));
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
            case "content": return "Catre continut"; break;
            case "category": return "Catre categorie"; break;
            case "url": return "Catre URL"; break;
            default: return "Necunoscut"; break;
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