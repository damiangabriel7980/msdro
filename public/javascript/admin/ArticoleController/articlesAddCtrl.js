/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('articlesAddCtrl', ['$scope','$rootScope' ,'ContentService','$stateParams','$sce','$filter','$modalInstance','$state', function($scope,$rootScope,ContentService,$stateParams,$sce,$filter,$modalInstance,$state){
    ContentService.getAll.query().$promise.then(function(result) {
        $scope.grupe=result['groups'];
        $scope.groupMap={};
        for(var i =0;i<$scope.grupe.length;i++)
            $scope.groupMap[$scope.grupe[i]._id]=$scope.grupe[i].display_name;
        $scope.selectedGroup=$scope.grupe[0];
    });
    $scope.articolNou= {
        title: "",
        author: "",
        description: "",
        text: "",
        type: "",
        last_updated: new Date(),
        version: 1,
        enable: false,
        image_path: "",
        groupsID: $scope.grupeUser
    };

    $scope.grupeUser=[];
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
    $scope.createArticle=function(){
        var id_groups=[];
        for(var i=0;i<$scope.grupeUser.length;i++)
            id_groups.push($scope.grupeUser[i]._id)
        $scope.articolNou.groupsID=id_groups;
        $scope.articolNou.text=tinyMCE.activeEditor.getContent();
        if($scope.articolNou){
            ContentService.getAll.save($scope.articolNou);
            $scope.newPerson = {};
            $state.go('continut.articole');
            tinyMCE.remove();
            $modalInstance.close();
        }
    };
      $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        $state.go('continut.articole');
        tinyMCE.remove();
        $modalInstance.close();
    };
}]);
