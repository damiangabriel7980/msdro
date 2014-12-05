cloudAdminControllers.controller('AddPublicCarouselController', ['$scope','CarouselPublicService','$modalInstance', '$state', 'AmazonService', function($scope, CarouselPublicService, $modalInstance, $state, AmazonService){

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.selectedType = 1;
    $scope.c = {};
    $scope.c['selected'] = {};

    //------------------------------------------------------------------------------------------------- form submission

    $scope.addImage = function () {
        var toSend = {};
        toSend.title = this.titlu?this.titlu:"";
        toSend.description = this.descriere?this.descriere:"";
        toSend.type = $scope.selectedType;


        //send data to server
        console.log(toSend);
//        CarouselPublicService.addContent.save({data: toSend}).$promise.then(function (resp) {
//            if(resp.error){
//                $scope.statusAlert.type = "danger";
//            }else{
//                $scope.statusAlert.type = "success";
//            }
//            $scope.statusAlert.message = resp.message;
//            $scope.statusAlert.newAlert = true;
//        });
    };


    //------------------------------------------------------------------------------------------------ useful functions

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
    }

}]);