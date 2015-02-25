controllers.controller('ViewEvents', ['$scope', '$state', 'EventsService', 'ngTableParams', '$filter', '$modal', 'ActionModal', function($scope, $state, EventsService, ngTableParams, $filter, $modal, ActionModal){

    var refreshEvents = function () {
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
    };
    refreshEvents();

    $scope.addEvent = function () {
        console.log("Add event");
    };

    $scope.toggleEventEnable = function (id, enable) {
        ActionModal.show(
            enable?"Dezactiveaza eveniment":"Activeaza eveniment",
            enable?"Sunteti sigur ca doriti sa dezactivati evenimentul?":"Sunteti sigur ca doriti sa activati evenimentul?",
            function () {
                EventsService.events.update({id: id}, {enable: !enable}).$promise.then(function (resp) {
                    console.log(resp);
                    refreshEvents();
                });
            },
            "Da"
        );
    };

    $scope.deleteEvent = function (id) {
        console.log("Delete event");
    };

}]);