/**
 * Created by miricaandrei23 on 26.11.2014.
 */
controllers.controller('TherapeuticAreas', ['$scope','$rootScope', '$state', 'areasAdminService','$stateParams','$sce','ngTableParams','$filter', 'ActionModal', function($scope,$rootScope, $state, areasAdminService,$stateParams,$sce,ngTableParams,$filter, ActionModal){
    areasAdminService.getAll.query().$promise.then(function(result){
        var arii = result;
        $scope.areasForFilter = result;
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

    $scope.deleteArea = function (id) {
        ActionModal.show("Stergere arie terapeutica", "Sunteti sigur ca doriti sa stergeti aria terapeutica?", function () {
            areasAdminService.deleteOrUpdateareas.delete({id: id}).$promise.then(function(result){
                console.log(result);
                $state.reload();
            });
        }, "Sterge");
    }

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
