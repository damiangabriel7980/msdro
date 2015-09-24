/**
 * Created by andreimirica on 23.09.2015.
 */
app.controllerProvider.register('CourseTestResult', ['$scope', '$rootScope', '$sce', '$modal','$timeout','$state','$modalInstance','testScore', function($scope, $rootScope, $sce, $modal,$timeout,$state,$modalInstance,testScore) {

    if(testScore == true && testScore != 1)
        $scope.score = 0;
    else
        $scope.score = testScore;

    $scope.closeModal=function(){
        $modalInstance.close();
    };

}]);