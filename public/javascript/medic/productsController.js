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
    $scope.lmt=8;
    $scope.increaseLimit=function(){
        $scope.lmt+=8;
    };
    $scope.firstLetters=[];
    ProductService.getByArea.query({id:$stateParams.id}).$promise.then(function(result){
         $scope.products = result;
        $scope.productsReserve=[];
        $scope.productsFiltered=[];
     for (var i=0;i<$scope.products.length;i++)
        {$scope.productsReserve.push($scope.products[i])}
        $scope.products.forEach(function (item) {
            var firstLetter = item.name.charAt(0);
            if ($scope.firstLetters.indexOf(firstLetter) === -1) {
                $scope.firstLetters.push(firstLetter);
            }
        });
    });
    $scope.filterResults=function(index){
        $scope.productsFiltered=[];
        if($scope.products.length!=$scope.productsReserve.length)
        {
            $scope.products=[];
            $scope.productsFiltered=[];
            for (var i=0;i<$scope.productsReserve.length;i++)
            {

                $scope.products.push($scope.productsReserve[i])
            }
        }
        var letter = $scope.firstLetters[index].toLowerCase();
        for (var i=0;i<$scope.products.length;i++)
        {
            if ($scope.products[i].name[0].toLowerCase() == letter)
            {
                $scope.productsFiltered.push($scope.products[i])
            }
        }
        $scope.products=$scope.productsFiltered;
    }
    $scope.reset=function(){
        $scope.products=$scope.productsReserve;
    }
    $scope.amazon = $rootScope.pathAmazonDev;
    $scope.closeLi=$sce.trustAsHtml("ng-class='hide'<\/li>");
    $scope.showElem ='{display: list-item}';
    $scope.hideElem = function(){
        $scope.showElem='{display: none}';
    }
  }])
    .filter('htmlToPlaintext2', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        }
    })
    .filter('mySort', function() {
        return function(input) {
            return input.sort();
        }
    });
