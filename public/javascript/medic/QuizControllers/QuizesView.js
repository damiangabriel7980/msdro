/**
 * Created by miricaandrei23 on 05.11.2014.
 */
controllers.controller('QuizesView', ['$scope','$rootScope' ,'quizesService','$stateParams','$sce','growl','$window','$timeout', function($scope,$rootScope,quizesService,$stateParams,$sce,growl,$window,$timeout){
    var date = new Date();
    quizesService.getAll.query().$promise.then(function(result){
        $scope.teste = result;
        //$scope.testeFiltered = [];
        //for (var i = 0; i < $scope.teste.length; i++) {
        //    if (new Date($scope.teste[i].expiry_date).getMonth() + 1 >= date.getMonth() + 1 && (new Date($scope.teste[i].expiry_date).getDay() >= date.getDay()))
        //        $scope.testeFiltered.push($scope.teste[i]);
        //}
    });
    //$scope.questions = testeService.getByTest.query({id:$stateParams.id});
    $scope.amazon = $rootScope.pathAmazonDev;
    angular.element("#footer").css({'position': 'absolute','bottom':0});
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.convertAndTrustAsHtml=function (data) {
        var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        return $sce.trustAsHtml(convertedText);
    };
}])
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').replace(/&acirc;/g,'â').replace(/&icirc;/g,'î').replace(/&#351;/g,'ş').replace(/&Acirc;/g,'Â').replace(/&Icirc;/g,'Î');
        }
    })
.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});