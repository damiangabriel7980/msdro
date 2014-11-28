/**
 * Created by miricaandrei23 on 27.11.2014.
 */
cloudAdminControllers.controller('articlesUpdateCtrl', ['$scope','$rootScope' ,'ContentService','$stateParams','$sce','$filter','$modalInstance','$state', function($scope,$rootScope,ContentService,$stateParams,$sce,$filter,$modalInstance,$state){
    ContentService.getAll.query().$promise.then(function(result) {
        $scope.grupe=result['groups'];
        $scope.groupMap={};
        for(var i =0;i<$scope.grupe.length;i++)
            $scope.groupMap[$scope.grupe[i]._id]=$scope.grupe[i].display_name;
        for(var i=0;i<$scope.grupe.length;i++)
        {
            for(var j=0;j<$scope.article.groupsID.length;j++)
            {
                if($scope.grupe[i]._id==$scope.article.groupsID[j])
                    $scope.grupeUser.push($scope.grupe[i]);
            }
        }
        $scope.selectedGroup=$scope.grupe[0];
    });
    ContentService.deleteOrUpdateContent.getContent({id:$stateParams.id}).$promise.then(function(result2){
        $scope.grupeUser=[];
        $scope.article=result2;

       tinyMCE.activeEditor.setContent($scope.article.text);
    });


    var findInUserGroup = function (id) {
        var index = -1;
        var i=0;
        var found = false;
        while(!found && i<$scope.grupeUser.length){
            if($scope.grupeUser[i]._id==id){
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
            if(index==-1) $scope.grupeUser.push(sel);

        }
    };

    $scope.removeUserGroup = function (id) {
        var index = findInUserGroup(id);
        if(index>-1){
            $scope.grupeUser.splice(index,1);
        }
    };
    $scope.updateArticle=function(){
        $scope.article.text=tinyMCE.activeEditor.getContent();
        var id_groups=[];
        for(var i=0;i<$scope.grupeUser.length;i++)
            id_groups.push($scope.grupeUser[i]._id)
        $scope.article.groupsID=id_groups;
        if($scope.article){
            ContentService.deleteOrUpdateContent.update({id:$stateParams.id},$scope.article);
            $state.go('continut.articole');
            tinyMCE.remove()
            $modalInstance.close();
        }
    };
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        $state.go('continut.articole');
        tinyMCE.remove()
        $modalInstance.close();
    };
}]);
