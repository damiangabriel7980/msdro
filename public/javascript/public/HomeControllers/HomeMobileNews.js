controllers.controller('HomeMobileNews', ['$scope', 'ContentService', 'Error', 'Success', function($scope, ContentService, Error, Success) {

    ContentService.mobileContent.query().$promise.then(function (resp) {
        if(Success.getObject(resp)){
            var categories = [];
            categories.push({
                name: "ULTIMELE NOUTATI",
                content: Success.getObject(resp).news
            });
            categories.push({
                name: "CELE MAI CITITE ARTICOLE",
                content: Success.getObject(resp).articles
            });
            categories.push({
                name: "DOWNLOADS",
                content: Success.getObject(resp).downloads
            });
            $scope.categories = categories;
        }
    }).catch(function(err){
        console.log(Error.getMessage(err.data));
    });

}]);