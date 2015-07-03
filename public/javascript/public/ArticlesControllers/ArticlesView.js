controllers.controller('ArticlesView', ['$scope', '$state', '$rootScope', '$stateParams', 'ContentService', 'Error', 'Success', function($scope, $state, $rootScope, $stateParams, ContentService, Error, Success) {

    $scope.articlesLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    ContentService.content.query({category: $stateParams.category}).$promise.then(function (resp) {
        $scope.news = Success.getObject(resp);
    }).catch(function(errNews){
        console.log(Error.getMessage(errNews));
    });
    ContentService.mostRead.query({type: 2}).$promise.then(function (resp) {
        $scope.mostRead = Success.getObject(resp);
    }).catch(function(errMostRead){
        console.log(Error.getMessage(errMostRead));
    });

    //------------ get category name
    $scope.categoryName = $rootScope.getNavCategoryName($stateParams.category);

    $scope.navigateToArticles = function (content) {
        $state.go('articole.detail', {id: content._id});
    }

}]);