(function() {
  var scripts = document.getElementsByTagName("script");
  var currentScriptPath = scripts[scripts.length-1].src;

  angular.module('singleUploadManager', []).directive('singleUploadManager', ['AmazonService', 'ActionModal', function(AmazonService, ActionModal) {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('singleUploadManager.js', 'singleUploadManager.html'),
      scope: {
        label:"@",
        onCompleteFunction:"&",
        onDeleteFunction:"&",
        fileType:"@",
        path:"@"
      },
      link: function(scope, element, attrs) {

        var fileName;

        attrs.$observe('fileName', function (newVal) {
          fileName = newVal;
        });


        var resetS3Alert = function (type, text) {
          scope.s3Alert = {
            type: type?type:"danger",
            show: text?true:false,
            text: text?text:"Unknown error"
          }
        };

        scope.bucketUrl = AmazonService.getBucketUrl();

        var initialize = function () {
          resetS3Alert("warning","Loading files...");
          AmazonService.getContentsAtPath(scope.path, function (err, contentsArray) {
            if(err){
              resetS3Alert("danger","Error loading files");
            }else{
              if(contentsArray && contentsArray.length){
                scope.filePath = contentsArray[0].Key;
              }
              resetS3Alert();
              scope.$apply();
            }
          });
        };

        var changeFile = function (file) {
          if(scope.filePath){
            resetS3Alert("warning","Se sterge fisierul vechi...");
            AmazonService.deleteFile(scope.filePath, function (err, success) {
              if(err){
                resetS3Alert("danger", "Eroare la stergerea fisierului");
              }else{
                uploadFile(file);
              }
            })
          } else {
            uploadFile(file);
          }
        };

        var uploadFile = function (file) {
          resetS3Alert("warning", "Se incarca fisierul...");
          var pathForUpload = scope.path + fileName + '.' + file.name.split('.').pop();
          AmazonService.uploadFile(file, pathForUpload, function (err, success) {
            if(err){
              resetS3Alert("danger", "Eroare la upload");
            }else{
              scope.filePath = pathForUpload;
              resetS3Alert();
              scope.$apply();
              scope.onCompleteFunction({key:scope.filePath});
            }
          });
        };

        scope.s3ManagerFileSelected = function ($files) {
          if($files[0]){
            changeFile($files[0]);
          }else{
            resetS3Alert("danger", "Nu a fost gasit fisierul");
          }
        };

        scope.removeFile = function () {
          resetS3Alert("warning","Se sterge fisierul...");
          AmazonService.deleteFile(scope.filePath, function (err, success) {
            if(err){
              resetS3Alert("danger", "Eroare la stergerea fisierului");
            }else{
              scope.filePath = null;
              resetS3Alert();
              scope.$apply();
              scope.onDeleteFunction({key:scope.filePath});
            }
          })
        };

        attrs.$observe('path', function (newVal) {
          scope.path = newVal;
          initialize();
        });
      }
    };
  }]);
})();
