/**
 * Created by miricaandrei23 on 29.10.2014.
 */
app.controllerProvider.register('EventModal', ['$scope', 'eventsService', '$stateParams', '$modal', '$log', '$modalInstance', '$state', 'idEvent', '$sce', '$timeout', 'Success', 'Error', 'HomeService', 'Utils', function ($scope, eventsService, $stateParams, $modal, $log, $modalInstance, $state, idEvent, $sce, $timeout, Success, Error, HomeService, Utils) {

    eventsService.calendar.query({id: idEvent}).$promise.then(function (resp) {
        $scope.itemsEvent = Success.getObject(resp);
        $scope.itemsEvent.days = {};
        for (var i = 0; i < $scope.itemsEvent.conferences.length; i++) {
            for (var j = 0; j < $scope.itemsEvent.conferences[i].talks.length; j++) {
                var talkBeginDate = Utils.customDateFormat(new Date($scope.itemsEvent.conferences[i].talks[j].hour_start), {
                    reverse: true,
                    prefixZero: true,
                    separator: " "
                });

                if($scope.itemsEvent.days[talkBeginDate]) {
                    if (!$scope.itemsEvent.days[talkBeginDate][$scope.itemsEvent.conferences[i].title]) {
                        $scope.itemsEvent.days[talkBeginDate][$scope.itemsEvent.conferences[i].title] = [];
                        $scope.itemsEvent.days[talkBeginDate][$scope.itemsEvent.conferences[i].title].push($scope.itemsEvent.conferences[i].talks[j]);
                    }
                    else {
                        $scope.itemsEvent.days[talkBeginDate][$scope.itemsEvent.conferences[i].title].push($scope.itemsEvent.conferences[i].talks[j]);
                    }
                }
                else
                {
                    var conferenceId={};
                    conferenceId[$scope.itemsEvent.conferences[i].title]  = [$scope.itemsEvent.conferences[i].talks[j]];
                    $scope.itemsEvent.days[talkBeginDate] = conferenceId;
                }



            }
        }
    });
    $scope.formatDate = function(date){
        var dateOut = new Date(date);
        return dateOut;
    };

    $scope.isEmpty=function(myObject) {
        for(var key in myObject) {
            if (myObject.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    }
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