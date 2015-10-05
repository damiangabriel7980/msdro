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
    if($scope.scorePercent >= $scope.minPercent)
        $scope.messageToShow = 'Felicitari! Ati trecut cu brio testul! Ati obtinut ' + $scope.score < 2 ? $scope.score + ' punct' : $scope.score + ' puncte.';
    else
        $scope.messageToShow = 'Din pacate nu ati trecut testul! Punctajul minim de trecere este de ' + $scope.minimum + ' puncte' + ', iar dvs. ati obtinut ' + $scope.score + ' puncte.';
    $scope.closeModal=function(){
        $modalInstance.close();
    };

}]);