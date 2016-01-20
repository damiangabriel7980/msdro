/**
 * Created by user on 28.10.2015.
 */
controllers.controller('guidelineCategoryModal',['$scope','GuideLineService','idToEdit','Success','$modalInstance','$state','$rootScope','AmazonService','InfoModal',function($scope,GuideLineService,idToEdit,Success,$modalInstance,$state,$rootScope,AmazonService,InfoModal){
        $scope.toEdit = idToEdit;

    var path = 'guideline/category/image/';
    $scope.showUploadButton = false;




    var resetS3Alert = function (type, text) {
        $scope.s3Alert = {
            type: type?type:"danger",
            show: text?true:false,
            text: text?text:"Unknown error"
        }
    };

    var refreshList = function (contentsArray) {
        $scope.keys = [];
        for(var i=0; i<contentsArray.length; i++){
            if(($rootScope.pathAmazonDev + contentsArray[i].Key).replace(/\s+/g,'%20') == $scope.category.imageUrl)
                $scope.keys.push(contentsArray[i].Key);
        }
        if($scope.keys.length >= 1)
            $scope.showUploadButton = false;
        else
            $scope.showUploadButton = true;
        $scope.showManager = true;

        resetS3Alert();
        $scope.$apply();
    };

    var initializeS3FileUploader = function () {
        resetS3Alert("warning","Loading files...");
        AmazonService.getContentsAtPath(path, function (err, contentsArray) {
            if(err){
                resetS3Alert("danger","Error loading files");
            }else{
                refreshList(contentsArray);
            }
        });
    };


    var findInKeys = function (key) {
        for(var i=0; i<$scope.keys.length; i++){
            if($scope.keys[i] == key) return i;
        }
        return -1;
    };

    var uploadFile = function (file, key) {
        resetS3Alert("warning", "Se incarca fisierul...");
        AmazonService.uploadFile(file, key, function (err, success) {
            if(err){
                resetS3Alert("danger", "Eroare la upload");
            }else{
                if(findInKeys(key) == -1) $scope.keys.push(key);
                resetS3Alert();
                $scope.showUploadButton = false;
                $scope.$apply();
            }
        });
    };

    var selectFiles = function($files, $event){
        if($files[0]){
            var extension = $files[0].name.split(".").pop();
            var key;
            //check fileType if specified
            if($scope.fileType && $scope.fileType.toLowerCase() != extension){
                ActionModal.show("Fisierul selectat nu este suportat");
            }else{
                key = path+$files[0].name;
                //check if file exists
                if(findInKeys(key) > -1){
                    ActionModal.show("Fisierul exista", "Un fisier cu acelasi nume exista deja. Doriti sa il suprascrieti?", function () {
                        uploadFile($files[0], key);
                    },{
                        yes: "Da"
                    });
                }else{
                    $rootScope.$broadcast('fileUpdated',key);
                    uploadFile($files[0], key);
                }
            }
        }else{
            resetS3Alert("danger", "Nu a fost gasit fisierul");
        }
    };

    $scope.s3ManagerFileSelected = function ($files, $event) {
        selectFiles($files,$event);

    };




    $scope.removeKey = function (index) {
        resetS3Alert("warning","Se sterge fisierul...");
        AmazonService.deleteFile($scope.keys[index], function (err, success) {
            if(err){
                resetS3Alert("danger", "Eroare la stergerea fisierului");
            }else{
                resetS3Alert();
                $scope.keys.splice(index,1);
                $scope.showUploadButton = true;
                $rootScope.$broadcast('fileDeleted');
                $scope.$apply();
            }
        });
    }

    var onInit = function(){
        GuideLineService.category.query({id:$scope.toEdit}).$promise.then(function(resp){
            $scope.category = Success.getObject(resp);
            initializeS3FileUploader();
        });
    };


















    onInit();

    $scope.showErr=false;

    $scope.closeModal = function(){
        $modalInstance.close();
    };

    $scope.$on('fileUpdated',function(event,imgUrl){
        $scope.category.imageUrl =($rootScope.pathAmazonDev+ imgUrl).replace(/\s+/g,'%20');
    });

    $scope.$on('fileDeleted',function(event){
        $scope.category.imageUrl='';
        var categoryToSave = $scope.category;
        categoryToSave = prepareCategory(categoryToSave);
        GuideLineService.category.update({id:$scope.toEdit,name:$scope.category.name},categoryToSave).$promise.then(function(resp){

        }).catch(function(err){
          if(err.status == 400)
            $scope.showErr = true;
        });
    });

    var prepareCategory = function(category){
      category.lastModified = new Date();
      delete category['_id'];
      return category;
    }

    $scope.save=function(category){
        var categoryToSave = prepareCategory(category);
        GuideLineService.category.update({id:$scope.toEdit,name:category.name},categoryToSave).$promise.then(function(resp){
            $modalInstance.close();
            $state.reload();
        }).catch(function(err){
          if(err.status == 400)
            $scope.showErr = true;
        });

    };
}]);
