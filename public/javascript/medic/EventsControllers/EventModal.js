/**
 * Created by miricaandrei23 on 29.10.2014.
 */
app.controllerProvider.register('EventModal', ['$scope', 'eventsService', '$stateParams', '$modal', '$log', '$modalInstance', '$state', 'idEvent', '$sce', '$timeout', 'Success', 'Error', 'HomeService', 'Utils', function ($scope, eventsService, $stateParams, $modal, $log, $modalInstance, $state, idEvent, $sce, $timeout, Success, Error, HomeService, Utils) {

    eventsService.calendar.query({id: idEvent}).$promise.then(function (resp) {
        $scope.itemsEvent = Success.getObject(resp);
        var resetTimeInDate = function (date) {
            return new Date(date.setHours(12, 0, 0, 0));
        };
        $scope.itemsEvent.days = {};
        for (var i = 0; i < $scope.itemsEvent.conferences.length; i++) {
            var conferenceBeginDate = Utils.customDateFormat(resetTimeInDate(new Date($scope.itemsEvent.conferences[i].begin_date)), {
                reverse: true,
                prefixZero: true,
                separator: "_"
            });
            if (!$scope.itemsEvent.days[conferenceBeginDate])
                $scope.itemsEvent.days[conferenceBeginDate] = [$scope.itemsEvent.conferences[i]];
            else
                $scope.itemsEvent.days[conferenceBeginDate].push($scope.itemsEvent.conferences[i]);
        }
    });
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };


    $scope.isCollapsed = true;
    $scope.subMenuCollapsed = false;


    $scope.closeModal = function () {
        $state.go('calendar', {id: null}, {}, {reload: true});
        $modalInstance.close();
        $stateParams.id = null;
    };
}]);

app.filterProvider.register("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});