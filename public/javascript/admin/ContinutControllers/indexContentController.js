/**
 * Created by miricaandrei23 on 06.01.2015.
 */
controllers.controller('indexContentController', ['$scope', '$rootScope', 'IndexService', '$state', function($scope, $rootScope, IndexService,$state){
    $scope.indexContent= function(){
        IndexService.getIndex.query().$promise.then(function(resp){
            console.log(resp);
        });
    };
}]);