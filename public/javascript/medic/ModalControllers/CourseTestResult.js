/**
 * Created by andreimirica on 23.09.2015.
 */
app.controllerProvider.register('CourseTestResult', ['$scope', '$rootScope', '$sce', '$modal','$timeout','$state','$modalInstance','testScore', function($scope, $rootScope, $sce, $modal,$timeout,$state,$modalInstance,testScore) {

    $scope.score = testScore;

    $scope.closeModal=function(){
        $modalInstance.close();
    };

}]);