/**
 * Created by user on 26.10.2015.
 */
controllers.controller('guidelineFileModal',['$scope','idToEdit','$modalInstance','GuideLineService','Success','$timeout','$state','$rootScope','AmazonService','ActionModal',function($scope,idToEdit,$modalInstance,GuideLineService,Success,$timeout,$state,$rootScope,AmazonService,ActionModal){

    $scope.idToEdit = idToEdit;

    $scope.showErr = false;

    $scope.fileType = 'pdf';

    var path =AmazonService.getBucketUrl()+ 'guideline/category/file/';

    var checkForCategory = function(){
        for(var i = 0 ; i< $scope.categories.length;i++){
            if($scope.categories[i].name == $scope.file.guidelineCategoryName){
                $scope.selectedCategory = $scope.categories[i];
                break;
            }
            else{
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
        AmazonService.getFileAtPath(path, function (err, contentsArray) {
            if(err){
                resetS3Alert("danger","Error loading files");
            }else{
                refreshList(contentsArray,$scope.file.guidelineFileUrl);
            }
        });
    };

    var refreshList = function (contentsArray, filePath) {
        $scope.keys = [];
        for(var i=0; i<contentsArray.length; i++){
            if (contentsArray[i].Key == filePath){
            $scope.keys.push(contentsArray[i].Key);
            }
        }
        if($scope.keys.length >= 1)
        {   console.log($scope.keys.length);
            $scope.showUploadButton = false;
        }
            else {
            console.log($scope.keys.length);
            $scope.showUploadButton = true;
        }
        $scope.showManager = true;
        resetS3Alert();
        $scope.$apply();
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
        if($files[0]) {

            if ($files[0].size > 50000000) {
                ActionModal.show("Fisierul selectat este prea mare");
            } else{
                    var extension = $files[0].name.split(".").pop();
                    var key;
                    //check fileType if specified
                    if ($scope.fileType && $scope.fileType.toLowerCase() != extension) {
                        ActionModal.show("Fisierul selectat nu este suportat");
                    } else {
                        key = path + $files[0].name;

                        //check if file exists
                        if (findInKeys(key) > -1) {
                            ActionModal.show("Fisierul exista", "Un fisier cu acelasi nume exista deja. Doriti sa il suprascrieti?", function () {
                                uploadFile($files[0], key);
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

    $scope.removeKey = function (index) {
        resetS3Alert("warning","Se sterge fisierul...");
        AmazonService.deleteFile($scope.keys[index], function (err, success) {
            if(err){
                resetS3Alert("danger", "Eroare la stergerea fisierului");
            }else{
                resetS3Alert();
                $scope.keys.splice(index,1);
                $rootScope.$broadcast('fileDeleted');
                $scope.showUploadButton = true;
                $scope.$apply();
            }
        })
    }




    $scope.bucketUrl = AmazonService.getBucketUrl();

    $scope.$on('fileUpdated',function(event,updateFileInfo){
        $scope.file.guidelineFileUrl = updateFileInfo;
        $scope.file.actualName = updateFileInfo.split('/').pop();
        $scope.file.displayName = $scope.file.actualName.split('.',1)
    });

    $scope.$on('fileDeleted',function(event){
        $scope.file.guidelineFileUrl = '';
        $scope.file.displayName= $scope.file.actualName = 'Untitled';
    });

   var onInit = function(){

   GuideLineService.category.query().$promise.then(function(resp){
       $scope.categories = Success.getObject(resp);
   }).catch(function(err){
       console.log(err);
   });


   GuideLineService.file.query({id:$scope.idToEdit}).$promise.then(function(resp){
        $scope.file = Success.getObject(resp);
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
        file.guidelineCategoryName = $scope.selectedCategory.name;
        delete file['_id'];
        return file;
    };

    $scope.save = function(file){
        var fileIdToEdit = file._id;
        var fileToEdit = prepareFile(file);
        console.log(fileToEdit);

        GuideLineService.file.update({fileId:fileIdToEdit,displayName:file.displayName,categoryId:$scope.selectedCategory._id},fileToEdit).$promise.then(function(resp) {
            $state.reload();
            $modalInstance.close();
        }).catch(function(err){
            console.log(err);
            $scope.showErr = true;
        })
    };

    onInit();


}]);