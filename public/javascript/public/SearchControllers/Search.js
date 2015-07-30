/**
 * Created by miricaandrei23 on 20.02.2015.
 */
app.controllerProvider.register('Search', ['$scope', '$rootScope', 'HomeService', '$sce', '$state', 'Error', 'Success', function($scope, $rootScope, HomeService, $sce, $state, Error, Success) {

    HomeService.searchResults.query({term: $rootScope.textToSearch.toString()}).$promise.then(function(data){
            $scope.searchResults = Success.getObject(data);
    });

    $scope.getSearchCategory = function(content){
        switch(content.type){
            case 1: return "article"; break;
            case 2: return "article"; break;
            case 3: return "multimedia"; break;
            case 4: return "download"; break;
            default: return null;
        }
    };

    $scope.getCategory = function(type){
        switch(type){
            case 1: return "Categorie: Noutati"; break;
            case 2: return "Categorie: Articole"; break;
            case 3: return "Categorie: Bibilioteca de resurse"; break;
            case 4: return "Categorie: Aplicatii"; break;
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