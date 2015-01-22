publicControllers.controller('ElearningController', ['$scope', '$rootScope', 'ContentService', '$sce', '$stateParams', function($scope, $rootScope, ContentService, $sce, $stateParams) {

    $scope.contentLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    ContentService.contentByTypeAndTherapeuticArea.query({type: 3, tpa: $stateParams.area}).$promise.then(function (resp) {
        $scope.elearning = resp;
    });

    ContentService.therapeuticAreas.query().$promise.then(function (resp) {
        var areasOrganised = [];
        areasOrganised.push({id:0, name:"Toate", parent:true});
        for(var i=0; i<resp.length; i++){
            var thisArea = resp[i];
            if(thisArea['therapeutic-areasID'].length == 0){
                //it's a parent. Add it
                areasOrganised.push({id: thisArea._id, name:thisArea.name, parent:true});
                if(thisArea.has_children){
                    //find all it's children
                    for(var j=0; j < resp.length; j++){
                        if(resp[j]['therapeutic-areasID'].indexOf(thisArea._id)>-1){
                            //found one children. Add it
                            areasOrganised.push({id: resp[j]._id, name:resp[j].name, parent:false});
                        }
                    }
                }
            }
        }
        $scope.tpa = areasOrganised;
    });

    //------------------------------------------------------------------------------------------------ useful functions

    $scope.htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
    };

    $scope.createHeader = function (text,length) {
        return $scope.htmlToPlainText(text).substring(0,length)+"...";
    };

    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };

}]);