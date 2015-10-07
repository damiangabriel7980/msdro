/**
 * Created by andreimirica on 23.09.2015.
 */
app.controllerProvider.register('CourseTestResult', ['$scope', '$rootScope', '$sce', '$modal','$timeout','$state','$modalInstance','testScore','minimum','maximum', function($scope, $rootScope, $sce, $modal,$timeout,$state,$modalInstance,testScore,minimum,maximum) {

    if(typeof testScore == 'boolean'){
        $scope.score = 0;
    }
     else
       $scope.score = testScore;
    $scope.minimum = minimum;
    $scope.maximum = maximum;
    $scope.scorePercent = Math.round(($scope.score / $scope.maximum) * 100 );
    $scope.minPercent = Math.round(($scope.minimum / $scope.maximum) * 100 );
    if($scope.scorePercent >= $scope.minPercent && $scope.scorePercent != 0)
        $scope.messageToShow = 'Ati obtinut ' + $scope.score + ' puncte. Testul este promovat.';
    else
        $scope.messageToShow = 'Ati obtinut ' + $scope.score + ' puncte. Testul nu este promovat.';
    $scope.closeModal=function(){
        $modalInstance.close();
    };

}]);