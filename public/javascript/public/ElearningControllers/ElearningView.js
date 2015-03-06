controllers.controller('ElearningView', ['$scope', '$rootScope', 'ContentService', '$sce', '$stateParams', function($scope, $rootScope, ContentService, $sce, $stateParams) {

    $scope.contentLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    ContentService.therapeuticAreas.query().$promise.then(function (resp) {
        var areasOrganised = [];
        areasOrganised.push({_id:0, name:"Toate", has_children:false});
        for(var i=0; i<resp.length; i++){
            var thisArea = resp[i];
            if(thisArea['therapeutic-areasID'].length == 0){
                //it's a parent. Add it
                areasOrganised.push(thisArea);
                if(thisArea.has_children){
                    //find all it's children
                    for(var j=0; j < resp.length; j++){
                        if(resp[j]['therapeutic-areasID'].indexOf(thisArea._id)>-1){
                            //found one children. Add it
                            resp[j]['ident']=true;
                            areasOrganised.push(resp[j]);
                        }
                    }
                }
            }
        }
        $scope.tpa = areasOrganised;

        $scope.$watch('$stateParams', function (val) {
            var area = $scope.tpa[val.area];
            console.log(area);
            ContentService.content.query({type: 3, area: area._id}).$promise.then(function (resp) {
                $scope.elearning = resp.success;
            });
        });

    });

}]);