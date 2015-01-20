/**
 * Created by miricaandrei23 on 03.11.2014.
 */
cloudAdminControllers.controller('productDetailsController', ['$scope','$rootScope' ,'ProductService','$stateParams','$sce','$window','$timeout', function($scope,$rootScope,ProductService,$stateParams,$sce,$window,$timeout) {

    window.scrollTo(0,0);

     ProductService.getSingle.query({id:$stateParams.id}).$promise.then(function(result){
         $scope.selectedProduct = result;
         $scope.ProductDetailsHTML = $sce.trustAsHtml(result.description);
         $timeout(function(){
             //if(angular.element(".main-view-container").outerHeight()>angular.element($window).height())
             //    var margin = Math.floor(angular.element(".main-view-container").outerHeight() - angular.element($window).height() - angular.element('#footer').outerHeight());
             //else
             var margin = Math.floor(angular.element($window).height() - angular.element(".main-view-container").outerHeight() - angular.element('#footer').outerHeight()-15);
             angular.element("#footer").css({'margin-top': (margin > 0 ? margin : 10)});
         },300);
     });

    $scope.amazon = $rootScope.pathAmazonDev;
}]);
