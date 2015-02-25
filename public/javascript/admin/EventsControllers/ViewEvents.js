controllers.controller('ViewEvents', ['$scope', '$state', 'EventsService', 'ngTableParams', '$filter', '$modal', 'ActionModal', function($scope, $state, EventsService, ngTableParams, $filter, $modal, ActionModal){

    EventsService.events.query().$promise.then(function(resp){
        var events = resp.success;
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
            total: events.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(events, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });

    $scope.toggleEventEnable = function (id, enabled) {
        ActionModal.show(
            enabled?"Dezactiveaza eveniment":"Activeaza eveniment",
            enabled?"Sunteti sigur ca doriti sa dezactivati evenimentul?":"Sunteti sigur ca doriti sa activati evenimentul?",
            function () {
                EventsService.events.update({id: id}, {enabled: !enabled}).$promise.then(function (resp) {
                    console.log(resp);
                    $state.reload();
                });
            }
        );
    };

    $scope.deleteEvent = function (id) {
        ActionModal.show("Stergere eveniment", "Sunteti sigur ca doriti sa stergeti acest eveniment?", function () {
            EventsService.events.delete({id: id}).$promise.then(function (resp) {
                console.log(resp);
                $state.reload();
            });
        }, "Sterge");
    };

}]);