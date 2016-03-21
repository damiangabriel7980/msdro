/**
 * Created by Administrator on 17/09/15.
 */
controllers.controller('EditCourse', ['$scope', '$rootScope', '$state', '$stateParams', 'ElearningService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', 'Success', 'Error', 'GroupsService', 'Utils', '$timeout', function ($scope, $rootScope, $state, $stateParams, ElearningService, AmazonService, $modal, InfoModal, ActionModal, Success, Error, GroupsService, Utils,$timeout) {

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.courseNavigation = $stateParams.courseNav.split(",");

    var gm;
    $(document).ready(function(){
        init();
    });

    function init(){
        ElearningService.courses.query({id: $stateParams.courseId}).$promise.then(function(resp){
            $scope.course = Success.getObject(resp);
            $scope.selectedGroups = $scope.course.groupsID;

            $('#mgrid').html($scope.course.description);
            $('#mgrid').gridEditor({
                new_row_layouts: [[12], [6, 6], [9, 3], [3, 3, 3, 3], [4, 4, 4]],
                content_types: ['ckeditor']
            });
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    GroupsService.groups.query().$promise.then(function (resp) {
        $scope.allGroups = Success.getObject(resp);
    }).catch(function(err){
        console.log(Error.getMessage(err));
    });

    $scope.uploadAlert = {newAlert:false, type:"", message:""};


    var putLogoS3 = function (body) {
        AmazonService.getClient(function (s3) {
            var extension = body.name.split('.').pop();
            var key = "elearning/courses/"+$scope.course._id+"/image"+$scope.course._id+"."+extension;
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                if (err) {
                    console.log(err);
                    $scope.uploadAlert.type = "danger";
                    $scope.uploadAlert.message = "Upload esuat!";
                    $scope.uploadAlert.newAlert = true;
                    $scope.$apply();
                } else {
                    //update database as well
                    ElearningService.courses.update({id:$scope.course._id},{imagePath:key}).$promise.then(function (resp) {
                        $scope.logo = key;
                        $scope.uploadAlert.type = "success";
                        $scope.uploadAlert.message = "Image updated!";
                        $scope.uploadAlert.newAlert = true;
                        console.log("Upload complete");
                        $scope.imagePath = $rootScope.pathAmazonDev+key;
                    }).catch(function(err){
                        $scope.uploadAlert.type = "danger";
                        $scope.uploadAlert.message = Error.getMessage(err);
                        $scope.uploadAlert.newAlert = true;
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
                if($scope.course.image_path){
                    key =$scope.course.image_path;
                    s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:key}, function (err, data) {
                        if(err){
                            $scope.uploadAlert.type = "danger";
                            $scope.uploadAlert.message = "Eroare la stergerea imaginii vechi!";
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

    $scope.saveChanges = function(){
        var id_groups=[];
        for(var i=0;i<$scope.selectedGroups.length;i++){
            id_groups.push($scope.selectedGroups[i]._id);
        }
        $scope.course.groupsID = id_groups;
        $scope.course.description = $("#mgrid").gridEditor('getHtml');
        ElearningService.courses.update({id: $stateParams.courseId},{course: $scope.course}).$promise.then(function(resp){
            $scope.$parent.courses[$scope.courseNavigation[0]].title = $scope.course.title;
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };
}]);