/**
 * Created by miricaandrei23 on 27.11.2014.
 */
cloudAdminControllers.controller('articlesUpdateCtrl', ['$scope','$rootScope' ,'ContentService','$stateParams','$sce','$filter','$modalInstance','$state','AmazonService', function($scope,$rootScope,ContentService,$stateParams,$sce,$filter,$modalInstance,$state,AmazonService){
    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};
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
    var putLogoS3 = function (body) {
        AmazonService.getClient(function (s3) {
            var extension = body.name.split('.').pop();
            var key = "content/"+$scope.article._id+"/article-logo/logo"+$scope.article._id+"."+extension;
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                if (err) {
                    console.log(err);
                    $scope.uploadAlert.type = "danger";
                    $scope.uploadAlert.message = "Upload esuat!";
                    $scope.uploadAlert.newAlert = true;
                    $scope.$apply();
                } else {
                    //update database as well
                    ContentService.editImage.save({data:{id:$scope.article._id, path:key}}).$promise.then(function (resp) {
                        if(resp.error){
                            $scope.uploadAlert.type = "danger";
                            $scope.uploadAlert.message = "Eroare la actualizarea bazei de date!";
                            $scope.uploadAlert.newAlert = true;
                        }else{
                            $scope.logo = key;
                            $scope.uploadAlert.type = "success";
                            $scope.uploadAlert.message = "Logo updated!";
                            $scope.uploadAlert.newAlert = true;
                            console.log("Upload complete");
                        }
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

    $scope.fileSelected = function($files, $event){
        //make sure group data is loaded. we need to access it to form the amazon key
            //make sure a file was actually loaded
            if($files[0]){
                AmazonService.getClient(function (s3) {
                    var key;
                    //if there already is a logo, delete it. Then upload new
                    if($scope.article.image_path){
                        key =$scope.article.image_path;
                        s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:key}, function (err, data) {
                            if(err){
                                $scope.uploadAlert.type = "danger";
                                $scope.uploadAlert.message = "Eroare la stergerea pozei vechi!";
                                $scope.uploadAlert.newAlert = true;
                                $scope.$apply();
                            }else{
                                putLogoS3($files[0]);
                            }
                        });
                    }else{
                        putLogoS3($files[0]);
                    }
                });
            }

    };

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
