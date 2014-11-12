/**
 * @ngdoc controller
 * @name cloudAdminControllers.controller:science_articlesCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


cloudAdminControllers.controller('productsController', ['$scope','$rootScope' ,'ProductService','$stateParams','$sce', function($scope,$rootScope,ProductService,$stateParams,$sce){

    $scope.allAreas=1;
    $scope.filtProd=[];
    ProductService.getByArea.query({id:$stateParams.id}).$promise.then(function(result){
         $scope.products = result;
    });
    $scope.amazon = $rootScope.pathAmazonDev;
    $scope.closeLi=$sce.trustAsHtml("ng-class='hide'<\/li>");
    $scope.showElem ='{display: list-item}';
    $scope.hideElem = function(){
        $scope.showElem='{display: none}';
    }
  }])
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        }
    });
