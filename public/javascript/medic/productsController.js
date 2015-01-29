/**
 * @ngdoc controller
 * @name cloudAdminControllers.controller:science_articlesCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


cloudAdminControllers.controller('productsController', ['$scope','$rootScope' ,'ProductService','$stateParams','$sce','$window','$timeout', function($scope,$rootScope,ProductService,$stateParams,$sce,$window,$timeout){

    $scope.allAreas=1;
    $scope.filtProd=[];
    $scope.lmt=8;
    $scope.message="";
    $scope.showMoreProd="show";
    $scope.increaseLimit=function(){

        $scope.lmt+=8;
        if($scope.products.length<=$scope.lmt)
            $scope.showMoreProd='hide';
    };
    $scope.firstLetters=[];
    ProductService.getByArea.query({id:$stateParams.id}).$promise.then(function(result){
         $scope.products = result;
        if($scope.products.length===0)
        {
            $scope.showMoreProd='hide';
            $scope.message="Nu sunt produse disponibile!";
        }
        $scope.productsReserve=[];
        $scope.productsFiltered=[];
        if($scope.products.length>8)
        {
            $scope.showMoreProd='show';
        }
        else
        {
            $scope.showMoreProd='hide';
        }
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
        if($scope.products.length===0)
        {
            $scope.showMoreProd='hide';
            $scope.message="Nu sunt produse disponibile";
        }
        if($scope.products.length>8)
        {
            $scope.showMoreProd='show';
        }
        else
        {
            $scope.showMoreProd='hide';
        }
        if($scope.products.length<=$scope.lmt)
            $scope.showMoreProd='hide';
        else
            $scope.showMoreProd='show';
    };
    $scope.reset=function(){
        $scope.products=$scope.productsReserve;
    };
    $scope.amazon = $rootScope.pathAmazonDev;
    $scope.closeLi=$sce.trustAsHtml("ng-class='hide'<\/li>");
    $scope.showElem ='{display: list-item}';
    $scope.hideElem = function(){
        $scope.showElem='{display: none}';
    }
  }])
    .filter('htmlToPlaintext2', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').replace(/&acirc;/g,'â').replace(/&icirc;/g,'î').replace(/&#351;/g,'ş').replace(/&Acirc;/g,'Â').replace(/&Icirc;/g,'Î');
        }
    })
    .filter('mySort', function() {
        return function(input) {
            return input.sort();
        }
    });
