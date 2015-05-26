controllers.controller('HomeMobileNews', ['$scope', 'ContentService', function($scope, ContentService) {

    ContentService.mobileContent.query().$promise.then(function (resp) {
        if(resp.success){
            var categories = [];
            categories.push({
                name: "ULTIMELE NOUTATI",
                content: resp.success.news
            });
            categories.push({
                name: "CELE MAI CITITE ARTICOLE",
                content: resp.success.articles
            });
            categories.push({
                name: "DOWNLOADS",
                content: resp.success.downloads
            });
            $scope.categories = categories;
        }
    });

}]);