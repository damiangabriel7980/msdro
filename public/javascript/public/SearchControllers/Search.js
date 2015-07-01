/**
 * Created by miricaandrei23 on 20.02.2015.
 */
controllers.controller('Search', ['$scope', '$rootScope', 'HomeService', '$sce', '$state', function($scope, $rootScope, HomeService, $sce, $state) {

    HomeService.searchResults.query({term: $rootScope.textToSearch.toString()}).$promise.then(function(data){
        if(data.success){
            $scope.searchResults = data.success;
        }
    }).catch(function(err){
        console.log(err.data.error);
    });

    $scope.getCategory = function(type){
        switch(type){
            case 1: return "Stiri"; break;
            case 2: return "Articole"; break;
            case 3: return "Elearning"; break;
            case 4: return "Downloads"; break;
            default: break;
        }
    };
    $scope.sref = function(item){
        switch(item.type){
            case 1: $state.go('stiri.detail', {id: item._id}); break;
            case 2: $state.go('articole.detail', {id: item._id}); break;
            case 3: $state.go('elearning.detail', {id: item._id}); break;
            case 4: $state.go('downloads.detail', {id: item._id}); break;
            default: break;
        }
    };

}]);