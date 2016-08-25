/**
 * Created by andrei.mirica on 24/08/16.
 */
controllers.controller('MainController', ['$scope', '$state', 'PreviewService', 'Success', function ($scope, $state, PreviewService, Success) {
    var queryParams = {
        type : $state.params.type
    };
    $scope.urlPro = $state.params.urlPro;
    switch ($state.params.type) {
        case ('resource') :
            queryParams.id = $state.params.articleId;
            queryParams.articleType = $state.params.articleType;
            break;
        case ('pathology') :
            queryParams.id = $state.params.pathology_id;
            break;
        case ('product') :
            queryParams.id = $state.params.product_id;
            break;
    }
    PreviewService.retrieveContent.query(queryParams).$promise.then(function (resp) {
        $scope.contentToDisplay = Success.getObject(resp);
    });
}]);