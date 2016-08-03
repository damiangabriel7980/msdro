/**
 * Created by andrei.mirica on 02/08/16.
 */
app.controllerProvider.register('medicalCourses', ['$scope', '$rootScope', '$sce', '$modal','$timeout','$state','$modalInstance','coursesService', 'Success', 'Error', function($scope, $rootScope, $sce, $modal,$timeout,$state,$modalInstance,coursesService,Success,Error) {

    $scope.resetAlert = function (message, type) {
        $scope.modalAlert = {
            show: message ? true : false,
            message: message,
            type: type || "danger"
        };
    };

    coursesService.requestToken.query().$promise.then(function (response) {
        $scope.medicalCoursesUrl = Success.getObject(response);
    }).catch(function(err){
        $scope.resetAlert(Error.getMessage(err));
    });

    $scope.closeModal=function(){
        $modalInstance.close();
    };

}]);