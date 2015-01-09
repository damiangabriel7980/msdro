/**
 * Created by miricaandrei23 on 05.11.2014.
 */
cloudAdminControllers.controller('testeController', ['$scope','$rootScope' ,'quizesService','$stateParams','$sce','growl', function($scope,$rootScope,quizesService,$stateParams,$sce,growl){
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
}])
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        }
    })
.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});