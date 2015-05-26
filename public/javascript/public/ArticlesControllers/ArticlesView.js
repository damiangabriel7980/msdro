controllers.controller('ArticlesView', ['$scope', '$rootScope', '$stateParams', 'ContentService', function($scope, $rootScope, $stateParams, ContentService) {

    $scope.articlesLimit = 3;
    $scope.categoryName = $stateParams.category_name;

    //------------------------------------------------------------------------------------------------- get all content

    ContentService.content.query({category: $stateParams.category}).$promise.then(function (resp) {
        $scope.news = resp.success;
    });
    ContentService.mostRead.query({type: 2}).$promise.then(function (resp) {
        $scope.mostRead = resp.success;
    });

}]);