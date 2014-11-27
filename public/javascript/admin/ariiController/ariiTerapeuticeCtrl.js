/**
 * Created by miricaandrei23 on 26.11.2014.
 */
cloudAdminControllers.controller('ariiTerapeuticeCtrl', ['$scope','$rootScope' ,'ariiAdminService','$stateParams','$sce','ngTableParams','$filter', function($scope,$rootScope,ariiAdminService,$stateParams,$sce,ngTableParams,$filter){
    ariiAdminService.getAll.query().$promise.then(function(result){
        var arii = result;
        console.log(result);
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                name: 'asc'     // initial sorting
            },
            filter: {
                name: ''       // initial filter
            }
        }, {
            total: arii.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(arii, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

}])
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        }
    })
    .filter("asDate", function () {
        return function (input) {
            return new Date(input);
        }
    });
