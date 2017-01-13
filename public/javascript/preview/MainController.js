/**
 * Created by andrei.mirica on 24/08/16.
 */
controllers.controller('MainController', ['$scope', '$state', 'PreviewService', 'Success', '$window', 'STATECONST', 'Utils', 'CookiesService', function ($scope, $state, PreviewService, Success, $window, STATECONST, Utils, CookiesService) {
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
        CookiesService.setCookie('appCode', $scope.contentToDisplay.activationCode);
        if($scope.contentToDisplay.menuItems){
            $scope.contentToDisplay.menuItems = Utils.bindAccordionToCollection($scope.contentToDisplay.menuItems, {open : false});
            var firstMenuItem = $scope.contentToDisplay.menuItems[0];
            var firstChildMenu = '';
            if(firstMenuItem.children_ids.length){
                firstChildMenu = firstMenuItem.children_ids[0]._id;
            }
            $scope.urlPro = STATECONST.STAYWELLPRO + STATECONST.PRODUCTMENUMAIN + $scope.contentToDisplay._id + STATECONST.PRODUCTMENUITEM + firstMenuItem._id + '/' + firstChildMenu;
        }
        if($scope.contentToDisplay.productType === 'resource'){
            $state.params.isResource = true;
        }
    });
    $scope.goToMenuItem = function (parentItem, childItem) {
        var proLink = STATECONST.STAYWELLPRO + STATECONST.PRODUCTMENUMAIN + $scope.contentToDisplay._id + STATECONST.PRODUCTMENUITEM + parentItem + '/';
        if(childItem)
            proLink += childItem;
        $window.location.href = proLink;
    }
}]);