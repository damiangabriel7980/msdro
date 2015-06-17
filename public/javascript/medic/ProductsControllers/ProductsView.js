/**
 * @ngdoc controller
 * @name controllers.controller:science_articlesCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


controllers.controller('ProductsView', ['$scope','$rootScope' ,'ProductService','$stateParams','$sce','$window','$timeout', function($scope,$rootScope,ProductService,$stateParams,$sce,$window,$timeout){
    window.scrollTo(0,0);
    $scope.lmt=8;
    $scope.message="";
    $scope.showMoreProd="show";
    $scope.status = {
        isopen: false
    };
    $scope.increaseLimit=function(){
        $scope.lmt+=8;
        if($scope.products.length<=$scope.lmt)
            $scope.showMoreProd='hide';
    };
    $scope.firstLetters={};
    $scope.allLetters = {};
    $scope.showOrHideButton = function(){
        if($scope.products.length===0)
        {
            $scope.showMoreProd='hide';
            $scope.message="Nu sunt produse disponibile!";
        }
        else{
            if($scope.products.length>8)
                $scope.showMoreProd='show';
            else
                $scope.showMoreProd='hide';
        }
    };
    ProductService.getByArea.query({id:$stateParams.id, specialGroup: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
            $scope.products = result;
            $scope.allLetters['A-Z'] = $scope.products;
            $scope.showOrHideButton();
            $scope.products.forEach(function (item) {
                var firstLetter = item.name.charAt(0);
                if (!$scope.firstLetters[firstLetter]) {
                    $scope.firstLetters[firstLetter] = [];
                }
                $scope.firstLetters[firstLetter].push(item);
            });

        });
    $scope.filterResults=function(key){
        if(key === 'A-Z')
            $scope.products = $scope.allLetters[key];
        else
            $scope.products = $scope.firstLetters[key];
        $scope.showOrHideButton();
    };
  }]);
