(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('enhancedS3UploadManager', []).directive('enhancedS3UploadManager', ['AmazonService', 'ActionModal','$rootScope', function(AmazonService, ActionModal,$rootScope) {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('enhancedS3Upload.js', 'enhancedS3Upload.html'),
            scope: {
              label:"@",
              onCompleteFunction:"&",
              fileType:"@",
              path:"@",
              limit:"@"
            },
            link: function(scope, element, attrs) {
              scope.keys = [];

                var nameAll;

                var resetS3Alert = function (type, text) {
                    scope.s3Alert = {
                        type: type?type:"danger",
                        show: text?true:false,
                        text: text?text:"Unknown error"
                    }
                };

                scope.bucketUrl = AmazonService.getBucketUrl();


                attrs.$observe('nameAll', function (newVal) {
                    nameAll = newVal;
                });


                var refreshList = function (contentsArray) {
                    scope.keys = [];
                    for(var i=0; i<contentsArray.length; i++){
                        scope.keys.push(contentsArray[i].Key);
                    }
                    scope.showManager = true;
                    resetS3Alert();
                    scope.$apply();
                };

                var initialize = function () {
                  scope.onCompleteFunction("asdasdasd");
                    resetS3Alert("warning","Loading files...");
                    AmazonService.getContentsAtPath(scope.path, function (err, contentsArray) {
                        if(err){
                            resetS3Alert("danger","Error loading files");
                        }else{
                            refreshList(contentsArray);
                        }
                    });
                };

                var findInKeys = function (key) {
                    for(var i=0; i<scope.keys.length; i++){
                        if(scope.keys[i] == key) return i;
                    }
                    return -1;
                };

                var uploadFile = function (file, key) {
                    resetS3Alert("warning", "Se incarca fisierul...");
                    AmazonService.uploadFile(file, key, function (err, success) {
                        if(err){
                            resetS3Alert("danger", "Eroare la upload");
                        }else{
                            if(findInKeys(key) == -1) scope.keys.push(key);
                            resetS3Alert();
                            scope.$apply();
                        }
                    });
                };

                var selectFiles = function($files, $event){
                    if($files[0]){
                        var extension = $files[0].name.split(".").pop();
                        var key;
                        //check fileType if specified
                        if(scope.fileType && scope.fileType.toLowerCase() != extension){
                            ActionModal.show("Fisierul selectat nu este suportat");
                        }else{
                            if(nameAll){
                                key=scope.path+nameAll+"."+extension;
                            }else{
                                key=scope.path+$files[0].name;
                            }
                            //check if file exists
                            if(findInKeys(key) > -1){
                                ActionModal.show("Fisierul exista", "Un fisier cu acelasi nume exista deja. Doriti sa il suprascrieti?", function () {
                                    uploadFile($files[0], key);
                                },{
                                    yes: "Da"
                                });
                            }else{
                                uploadFile($files[0], key);
                            }
                        }
                    }else{
                        resetS3Alert("danger", "Nu a fost gasit fisierul");
                    }
                };

                scope.s3ManagerFileSelected = function ($files, $event) {
                    selectFiles($files,$event);

                };

                scope.removeKey = function (index) {
                    resetS3Alert("warning","Se sterge fisierul...");
                    AmazonService.deleteFile(scope.keys[index], function (err, success) {
                        if(err){
                            resetS3Alert("danger", "Eroare la stergerea fisierului");
                        }else{
                            resetS3Alert();
                            scope.keys.splice(index,1);
                            scope.$apply();
                        }
                    })
                }

                initialize();
            }
        };
    }]);
})();
