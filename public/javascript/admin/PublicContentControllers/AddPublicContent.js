controllers.controller('AddPublicContent', ['$scope','publicContentService','$modalInstance', '$state', 'AmazonService', 'Success', 'Error', 'therapeuticAreas', function($scope, publicContentService, $modalInstance, $state, AmazonService, Success, Error, therapeuticAreas){

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.selectedType = 1;

    $scope.tinymceOptions = {
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        height: 500,
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

    //----------------------------------------------------------------------------------------------- categories

    publicContentService.categories.query().$promise.then(function (resp) {
        if(Success.getObject(resp)){
            $scope.categories = Success.getObject(resp);
            if(Success.getObject(resp).length > 0) $scope.selectedCategory = Success.getObject(resp)[0]._id;
        }
    }).catch(function(err){
        $scope.statusAlert.type = "danger";
        $scope.statusAlert.message = Error.getMessage(err);
        $scope.statusAlert.newAlert = true;
    });

    //----------------------------------------------------------------------------------------------- therapeutic areas

    //get all
    therapeuticAreas.areas.query().$promise.then(function (resp) {
        $scope.allAreas = Success.getObject(resp);
        $scope.selectedAreas = [];
    });

    //------------------------------------------------------------------------------------------------- form submission

    $scope.addContent = function () {
        var toSend = {};
        toSend.title = this.titlu?this.titlu:"";
        toSend.author = this.autor?this.autor:"";
        toSend.description = this.descriere?this.descriere:"";
        toSend.type = $scope.selectedType;
        toSend.category = this.selectedCategory;
        //form array of selected areas id's
        toSend['therapeutic-areasID'] = this.newAreas;
        //get content text
        toSend.text = this.contentText?this.contentText:"";
        //send data to server
        toSend.enable = false;
        toSend.date_added = Date.now();
        toSend.last_updated = Date.now();
        publicContentService.publicContent.create({data: toSend}).$promise.then(function (resp) {
                $scope.statusAlert.type = "success";
                $scope.statusAlert.message = Success.getMessage(resp);
            $scope.statusAlert.newAlert = true;
        }).catch(function(err){
            $scope.statusAlert.type = "danger";
            $scope.statusAlert.message = Error.getMessage(err);
            $scope.statusAlert.newAlert = true;
        });
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
        $state.reload();
        $modalInstance.close();
    }

}]);