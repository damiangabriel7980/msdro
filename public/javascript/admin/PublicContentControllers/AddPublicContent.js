controllers.controller('AddPublicContent', ['$scope','publicContentService','$modalInstance', '$state', 'AmazonService', 'Success', 'Error', function($scope, publicContentService, $modalInstance, $state, AmazonService, Success, Error){

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.selectedTherapeuticAreas = [];
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
        $scope.statusAlert.message = Error.getMessage(err.data);
        $scope.statusAlert.newAlert = true;
    });

    //----------------------------------------------------------------------------------------------- therapeutic areas

    //get all
    publicContentService.therapeuticAreas.query().$promise.then(function (resp) {
        var areasOrganised = [];
        areasOrganised.push({id:0, name:"Adauga arii terapeutice"});
        areasOrganised.push({id:1, name:"Toate"});
        for(var i=0; i<Success.getObject(resp).length; i++){
            var thisArea = Success.getObject(resp)[i];
            if(thisArea['therapeutic-areasID'].length == 0){
                //it's a parent. Add it
                areasOrganised.push({id: thisArea._id, name:thisArea.name});
                if(thisArea.has_children){
                    //find all it's children
                    for(var j=0; j < Success.getObject(resp).length; j++){
                        if(Success.getObject(resp)[j]['therapeutic-areasID'].indexOf(thisArea._id)>-1){
                            //found one children. Add it
                            areasOrganised.push({id: Success.getObject(resp)[j]._id, name:"0"+Success.getObject(resp)[j].name});
                        }
                    }
                }
            }
        }
        $scope.allAreas = areasOrganised;
        $scope.selectedArea = $scope.allAreas[0];

    }).catch(function(err){
        $scope.statusAlert.type = "danger";
        $scope.statusAlert.message = Error.getMessage(err.data);
        $scope.statusAlert.newAlert = true;
    });
    var findInUserAreas = function (id) {
        var index = -1;
        var i=0;
        var found = false;
        while(!found && i<$scope.selectedTherapeuticAreas.length){
            if($scope.selectedTherapeuticAreas[i].id==id){
                found = true;
                index = i;
            }
            i++;
        }
        return index;
    };
    $scope.areaWasSelected = function (sel) {
        if(sel.id!=0){
            if(sel.id==1){
                $scope.selectedTherapeuticAreas = [];
                for(var i=2; i<$scope.allAreas.length; i++){
                    $scope.selectedTherapeuticAreas.push($scope.allAreas[i]);
                }
            }else{
                var index = findInUserAreas(sel.id);
                if(index==-1) $scope.selectedTherapeuticAreas.push(sel);
            }
        }
    };
    $scope.removeUserArea = function (id) {
        var index = findInUserAreas(id);
        if(index>-1){
            $scope.selectedTherapeuticAreas.splice(index,1);
        }
    };

    //------------------------------------------------------------------------------------------------- form submission

    $scope.addContent = function () {
        var toSend = {};
        toSend.title = this.titlu?this.titlu:"";
        toSend.author = this.autor?this.autor:"";
        toSend.description = this.descriere?this.descriere:"";
        toSend.type = $scope.selectedType;
        toSend.category = this.selectedCategory;
        //form array of selected areas id's
        var areasIDs = [];
        for(var i=0; i<$scope.selectedTherapeuticAreas.length; i++){
            areasIDs.push($scope.selectedTherapeuticAreas[i].id);
        }
        toSend['therapeutic-areasID'] = areasIDs;
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
            $scope.statusAlert.message = Error.getMessage(err.data);
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