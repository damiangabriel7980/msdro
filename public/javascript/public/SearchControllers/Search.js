/**
 * Created by miricaandrei23 on 20.02.2015.
 */
controllers.controller('Search', ['$scope', '$rootScope', 'HomeService', '$sce', '$state', function($scope, $rootScope, HomeService, $sce, $state) {
    $scope.trustDescription = function(text){
        return $sce.trustAsHtml(text);
    };
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.convertAndTrustAsHtml=function (data,limit) {
        if(limit!=0)
            var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').substring(0,limit) + '...';
        else
            var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        return $sce.trustAsHtml(convertedText);
    };
    HomeService.getSearchResults.query({data:$rootScope.textToSearch.toString()}).$promise.then(function(results){
        $scope.searchResultsFirstSet=results;
        $scope.searchResults=[];
        if(!results[0].answer) {
            if ($scope.searchResultsFirstSet != undefined) {
                for (var i = 0; i < $scope.searchResultsFirstSet.length; i++) {
                    if ($scope.searchResultsFirstSet[i] != null)
                        $scope.searchResults.push($scope.searchResultsFirstSet[i]);
                }
            }
        }
            else
            {
                $scope.answer=results[0].answer;
            }

    });
    $scope.articlesLimit=3;
    $scope.getCategory=function(type){
        switch(type){
            case 1: return "Stiri"; break;
            case 2: return "Articole"; break;
            case 3: return "Elearning"; break;
            case 4: return "Downloads"; break;
            default: break;
        }
    };
    $scope.sref=function(type,id){
            switch(type){
            case 1: $state.go('stiri.detail', {id: id}); break;
            case 2: $state.go('articole.detail', {id: id}); break;
            case 3: $state.go('elearning.detail', {id: id}); break;
            case 4: $state.go('downloads.detail', {id: id}); break;
            default: break;
            }
    };
}]);