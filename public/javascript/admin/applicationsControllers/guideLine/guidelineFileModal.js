/**
 * Created by user on 26.10.2015.
 */
controllers.controller('guidelineFileModal',['$scope','idToEdit','$modalInstance','GuideLineService','Success','$timeout','$state','$rootScope','AmazonService','ActionModal',"InfoModal",function($scope,idToEdit,$modalInstance,GuideLineService,Success,$timeout,$state,$rootScope,AmazonService,ActionModal,InfoModal){

    $scope.idToEdit = idToEdit;

    $scope.showErr = false;

    $scope.fileType = 'pdf';

    var path = 'guideline/category/file/';

    var checkForCategory = function(){
        for(var i = 0 ; i< $scope.categories.length;i++){
            if($scope.categories[i].name == $scope.file.guidelineCategoryName){
                $scope.selectedCategory = $scope.categories[i];
                $scope.currentPath = path + $scope.selectedCategory._id;
                break;
            }
            else{
                $scope.currentPath = path
                $scope.selectedCategory = null;
            }
        }
    };


    var resetS3Alert = function (type, text) {
        $scope.s3Alert = {
            type: type?type:"danger",
            show: text?true:false,
            text: text?text:"Unknown error"
        }
    };



    var initializeS3UploadManager = function () {
        resetS3Alert("warning","Loading files...");
        AmazonService.getContentsAtPath(path, function (err, contentsArray) {
            if(err){
                resetS3Alert("danger","Error loading files");
            }else{
                refreshList(contentsArray,path);
            }
        });
    };

    var refreshList = function (contentsArray, filePath) {
        $scope.keys = [];
        $scope.toCompare = [];
        for(var i=0; i<contentsArray.length; i++){
            $scope.toCompare.push(contentsArray[i].Key);
            if (contentsArray[i].Key.replace(/%20/g,' ') == filePath + $scope.file.actualName){
                $scope.keys.push($rootScope.pathAmazonDev + contentsArray[i].Key);
            }
        }
        if($scope.keys.length >= 1)
            $scope.showUploadButton = false;
        else
            $scope.showUploadButton = true;
        $scope.showManager = true;
        resetS3Alert();
        $scope.$apply();
    };


    var findInKeys = function (key) {
        key = key.substring($rootScope.pathAmazonDev.length);
        for(var i=0; i< $scope.toCompare .length; i++){
            if( $scope.toCompare[i] == key) return i;
        }
        return -1;
    };


    var uploadFile = function (file, key) {
        resetS3Alert("warning", "Se incarca fisierul...");
        var newKey = key.substring($rootScope.pathAmazonDev.length);
        AmazonService.uploadFile(file, newKey, function (err, success) {
            if(err){
                resetS3Alert("danger", "Eroare la upload");
            }else{
                if(findInKeys(newKey) == -1) $scope.keys[0] = newKey;
                resetS3Alert();
                $scope.showUploadButton = false;
                $scope.$apply();
            }
        });
    };


    var selectFiles = function($files, $event){
        if($files[0]) {

            if ($files[0].size > 50000000) {
                InfoModal.show("Fisierul selectat este prea mare");
            } else{
                    var extension = $files[0].name.split(".").pop();
                    var key;
                    //check fileType if specified
                    if ($scope.fileType && $scope.fileType.toLowerCase() != extension) {
                        InfoModal.show("Fisierul selectat nu este suportat");
                    } else {
                        key = $rootScope.pathAmazonDev + path + $files[0].name;

                        //check if file exists
                        if (findInKeys(key) > -1) {
                            ActionModal.show("Fisierul exista", "Un fisier cu acelasi nume exista deja. Doriti sa il suprascrieti?", function () {
                                GuideLineService.file.delete({id:$scope.file._id}).$promise.then(function(resp){
                                     uploadFile($files[0], key);
                                    $modalInstance.close();
                                    $state.reload();
                                }).catch(function(err){
                                });

                            }, {
                                yes: "Da"
                            });
                        } else {
                            $rootScope.$broadcast('fileUpdated', key);
                            uploadFile($files[0], key);
                        }
                    }
            }
        }else{
            resetS3Alert("danger", "Nu a fost gasit fisierul");
        }
    };

    $scope.s3ManagerFileSelected = function ($files, $event) {
        selectFiles($files,$event);

    };

    var deleteFromAmazon = function(path,index){
      AmazonService.deleteFile(path,function(err,success){
        if(err){
          resetS3Alert("danger","Eroare la stergerea fisierului");
        }else{
          resetS3Alert();
          $scope.keys.splice(index,1);
          $rootScope.$broadcast('fileDeleted');
          $scope.showUploadButton = true;
          $scope.$apply();
        }
      });
    }

    $scope.removeKey = function (index) {
        resetS3Alert("warning","Se sterge fisierul...");
        if($scope.keys[index].search($rootScope.pathAmazonDev) == -1){
              deleteFromAmazon($scope.keys[index],index);
        }else{
          deleteFromAmazon($scope.keys[index].substring($rootScope.pathAmazonDev.length),index)
        }
    }




    $scope.bucketUrl = AmazonService.getBucketUrl();

    $scope.$on('fileUpdated',function(event,updateFileInfo){
        $scope.file.guidelineFileUrl = updateFileInfo.replace(/\s+/g, '%20');
        $scope.file.actualName = updateFileInfo.split('/').pop();
        $scope.file.displayName = $scope.file.actualName.split('.',1)
        $scope.save($scope.file,true);
    });

    $scope.$on('fileDeleted',function(event){
        $scope.file.guidelineFileUrl = '';
        $scope.file.displayName= $scope.file.actualName = 'Untitled';
        $scope.save($scope.file,true)
    });

   var onInit = function(){

   GuideLineService.category.query().$promise.then(function(resp){
       $scope.categories = Success.getObject(resp);
   }).catch(function(err){
   });


   GuideLineService.file.query({id:$scope.idToEdit}).$promise.then(function(resp){
        $scope.file = Success.getObject(resp);
        $scope.oldCategoryName = $scope.file.guidelineCategoryName;
       checkForCategory();
       initializeS3UploadManager();
    }).catch(function(err){

   });


   };

    $scope.closeModal = function () {
        $modalInstance.close();
    };

    var prepareFile = function(file){

        file.lastModified = new Date();
        if ($scope.selectedCategory){
            file.guidelineCategoryName = $scope.selectedCategory.name;
            $scope.categoryId = $scope.selectedCategory._id;
        }else{
            $scope.categoryId = null;
        }
        delete file['_id'];
        file.displayName = $scope.file.displayName;
        return file;
    };

    $scope.save = function(file,keepModalOpen){
        var fileToEdit = prepareFile(file);

        GuideLineService.file.update({fileId:$scope.idToEdit,displayName:file.displayName,categoryId: $scope.categoryId},fileToEdit).$promise.then(function(resp) {
            $state.reload();
            if(!keepModalOpen)
                 $modalInstance.close();
        }).catch(function(err){
            if(err.status == 400)
              $scope.showErr = true;
        })
    };

    onInit();

}]);
