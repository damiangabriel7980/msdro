controllers.controller('ViewSpeakers', ['$scope', '$state', 'EventsService', 'ngTableParams', '$filter', '$modal', 'ActionModal', function($scope, $state, EventsService, ngTableParams, $filter, $modal, ActionModal){

    EventsService.speakers.query().$promise.then(function(resp){
        var speakers = resp.success;
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                first_name: 'asc'     // initial sorting
            },
            filter: {
                first_name: ''       // initial filter
            }
        }, {
            total: speakers.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(speakers, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });

    $scope.add = function () {
        $modal.open({
            templateUrl: 'partials/admin/content/events/modalEditSpeaker.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'AddSpeaker'
        });
    };

    $scope.update = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/content/events/modalEditSpeaker.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'UpdateSpeaker',
            resolve: {
                idToUpdate: function () {
                    return id;
                }
            }
        });
    };

}]);