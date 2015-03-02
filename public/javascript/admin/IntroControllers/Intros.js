controllers.controller('Intro', ['$scope','$rootScope' ,'IntroService','$stateParams','$sce','$filter','$state','ngTableParams','$modal', function($scope,$rootScope,IntroService,$stateParams,$sce,$filter,$state,ngTableParams,$modal){
    IntroService.getIntros.query().$promise.then(function (data) {
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                description: 'asc'     // initial sorting
            },
            filter: {
                description: ''       // initial filter
            }
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(data, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });
    $scope.viewIntro= function(id){
        $modal.open({
            templateUrl: 'partials/admin/content/IntroDetails.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'IntroDetails',
            resolve: {
                idToView: function () {
                    return id;
                }
            }
        });
    };
    $scope.addIntro= function(){
        $modal.open({
            templateUrl: 'partials/admin/content/introAdd.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'IntroAdd'
        });
    };
    $scope.deleteIntro= function(id){
        console.log(id);
        $modal.open({
            templateUrl: 'partials/admin/content/deleteIntro.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'IntroDelete',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        });
    }
}]);