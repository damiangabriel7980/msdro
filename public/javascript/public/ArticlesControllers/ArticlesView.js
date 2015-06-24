controllers.controller('ArticlesView', ['$scope', '$state', '$rootScope', '$stateParams', 'ContentService', function($scope, $state, $rootScope, $stateParams, ContentService) {

    $scope.articlesLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    ContentService.content.query({category: $stateParams.category}).$promise.then(function (resp) {
        $scope.news = resp.success;
    });
    ContentService.mostRead.query({type: 2}).$promise.then(function (resp) {
        $scope.mostRead = resp.success;
    });

    //------------ get category name
    $scope.categoryName = $rootScope.getNavCategoryName($stateParams.category);

    $scope.navigateToArticles = function (content) {
        $state.go('articole.detail', {id: content._id});
    }

}]);