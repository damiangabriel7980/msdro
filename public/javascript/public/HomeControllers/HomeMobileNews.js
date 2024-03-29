app.controllerProvider.register('HomeMobileNews', ['$scope', 'ContentService', 'Error', 'Success', function($scope, ContentService, Error, Success) {

    ContentService.mobileContent.query().$promise.then(function (resp) {
        resp = Success.getObject(resp);
        if(resp){
            var categories = [];
            categories.push({
                name: "ULTIMELE NOUTATI",
                content: resp.news
            });
            categories.push({
                name: "CELE MAI CITITE ARTICOLE",
                content: resp.articles
            });
            categories.push({
                name: "CATEGORII",
                isCategory: true,
                content: resp.mobileCategories
            });
            categories.push({
                name: "APLICATII",
                content: resp.downloads
            });
            $scope.categories = categories;
        }
    });

}]);