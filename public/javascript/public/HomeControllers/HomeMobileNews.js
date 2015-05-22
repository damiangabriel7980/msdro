controllers.controller('HomeMobileNews', ['$scope', '$state', 'ContentService', function($scope, $state, ContentService) {

    ContentService.mobileContent.query().$promise.then(function (resp) {
        if(resp.success){
            var categories = [];
            categories.push({
                name: "ULTIMELE NOUTATI",
                content: resp.success.news,
                sref: "stiri.detail"
            });
            categories.push({
                name: "CELE MAI CITITE ARTICOLE",
                content: resp.success.articles,
                sref: "articole.detail"
            });
            categories.push({
                name: "DOWNLOADS",
                content: resp.success.downloads,
                sref: "downloads.detail"
            });
            $scope.categories = categories;
        }
    });

    $scope.navigateTo = function (sref, params) {
        $state.go(sref, params);
    }

}]);