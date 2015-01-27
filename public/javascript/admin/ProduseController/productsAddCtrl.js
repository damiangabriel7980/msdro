/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('productsAddCtrl', ['$scope','$rootScope' ,'ProductService','$stateParams','$sce','$filter','$modalInstance','therapeuticAreaService','$state', function($scope,$rootScope,ProductService,$stateParams,$sce,$filter,$modalInstance,therapeuticAreaService,$state){
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        $modalInstance.close();
    };
    $scope.newProduct={
        name: "",
        description: "",
        last_updated: new Date(),
        enable: true,
        image_path: "",
        file_path: "",
        groupsID: $scope.grupeUser,
        'therapeutic-areasID':$scope.productsTherapeuticAreas
    };
    $scope.createProduct=function(){
        var id_groups=[];
        for(var i=0;i<$scope.groupsProduct.length;i++)
            id_groups.push($scope.groupsProduct[i]._id)
        $scope.newProduct.groupsID=id_groups;
        $scope.newProduct['therapeutic-areasID']=$scope.productsTherapeuticAreas;
        $scope.newProduct.description=tinyMCE.activeEditor.getContent();
        if($scope.newProduct){
            ProductService.getAll.save($scope.newProduct);
            $scope.newProduct = {};
            $state.go('continut.produse');
            $modalInstance.close();
        }
    };
    ProductService.getAll.query().$promise.then(function(resp){
        $scope.grupe=resp['groups'];
        $scope.groupMap={};
        for(var i =0;i<$scope.grupe.length;i++)
            $scope.groupMap[$scope.grupe[i]._id]=$scope.grupe[i].display_name;
        $scope.selectedGroup=$scope.grupe[0];
    });
    $scope.groupsProduct=[];
    $scope.productsTherapeuticAreas=[];
    var findInUserGroup = function (id) {
        var index = -1;
        var i=0;
        var found = false;
        while(!found && i<$scope.groupsProduct.length){
            if($scope.groupsProduct[i]._id==id){
                found = true;
                index = i;
            }
            i++;
        }
        return index;
    };
    $scope.groupWasSelected = function (sel) {
        if(sel._id!=0){

            var index = findInUserGroup(sel._id);
            if(index==-1) $scope.groupsProduct.push(sel);

        }
    };

    $scope.removeUserGroup = function (id) {
        var index = findInUserGroup(id);
        if(index>-1){
            $scope.groupsProduct.splice(index,1);
        }
    };
    therapeuticAreaService.query().$promise.then(function (resp) {
        var areasOrganised = [];
        areasOrganised.push({id:0, name:"Adauga arii terapeutice"});
        areasOrganised.push({id:1, name:"Toate"});
        for(var i=0; i<resp.length; i++){
            var thisArea = resp[i];
            if(thisArea['therapeutic-areasID'].length == 0){
                //it's a parent. Add it
                areasOrganised.push({id: thisArea._id, name:thisArea.name});
                if(thisArea.has_children){
                    //find all it's children
                    for(var j=0; j < resp.length; j++){
                        if(resp[j]['therapeutic-areasID'].indexOf(thisArea._id)>-1){
                            //found one children. Add it
                            areasOrganised.push({id: resp[j]._id, name:"0"+resp[j].name});
                        }
                    }
                }
            }
        }

        $scope.allAreas = areasOrganised;
        $scope.selectedArea = $scope.allAreas[0];

    });
    var findInProductsAreas = function (id) {
        var index = -1;
        var i=0;
        var found = false;
        while(!found && i<$scope.productsTherapeuticAreas.length){
            if($scope.productsTherapeuticAreas[i].id==id){
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
                $scope.productsTherapeuticAreas = [];
                for(var i=2; i<$scope.allAreas.length; i++){
                    $scope.productsTherapeuticAreas.push($scope.allAreas[i]);
                }
            }else{
                var index = findInProductsAreas(sel.id);
                if(index==-1) $scope.productsTherapeuticAreas.push(sel);
            }
        }
    };

    $scope.removeProductArea = function (id) {
        var index = findInProductsAreas(id);
        if(index>-1){
            $scope.productsTherapeuticAreas.splice(index,1);
        }
    };

    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };
}]);
