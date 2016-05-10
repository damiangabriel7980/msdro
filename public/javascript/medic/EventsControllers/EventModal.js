/**
 * Created by miricaandrei23 on 29.10.2014.
 */
app.controllerProvider.register('EventModal', ['$scope', 'eventsService', '$stateParams', '$modal', '$log', '$modalInstance', '$state', 'idEvent', '$sce', '$timeout', 'Success', 'Error', 'HomeService', 'Utils', function ($scope, eventsService, $stateParams, $modal, $log, $modalInstance, $state, idEvent, $sce, $timeout, Success, Error, HomeService, Utils) {

    eventsService.calendar.query({id: idEvent}).$promise.then(function (resp) {
        var eventDetails = Success.getObject(resp);
        eventDetails = Success.getObject(resp);
        $scope.titleDateDisplay = formatTitleDate(eventDetails.event.start, eventDetails.event.end);
        eventDetails.days = {};
        for (var i = 0; i < eventDetails.conferences.length; i++) {
            var conference = eventDetails.conferences[i];
            for (var j = 0; j < conference.talks.length; j++) {
                var talkBeginDate = Utils.customDateFormat(new Date(conference.talks[j].hour_start), {
                    reverse: true,
                    prefixZero: true,
                    separator: "-"
                });

                if(eventDetails.days[talkBeginDate]) {
                    if (!eventDetails.days[talkBeginDate][conference.title]) {
                        eventDetails.days[talkBeginDate][conference.title] = {
                            description: conference.description,
                            talks:[]
                        };
                    }
                    eventDetails.days[talkBeginDate][conference.title].talks.push(conference.talks[j]);
                }
                else
                {
                    var conferences={};
                    conferences[conference.title]  = {
                        description: conference.description,
                        talks: [conference.talks[j]]
                    };
                    eventDetails.days[talkBeginDate] = conferences;
                }
            }
        }
        $scope.eventDetails = eventDetails;
    });

    function formatTitleDate(start, end){
        var result = "";
        var year = "";
        if(start){
            year = new Date(start).getFullYear();
            start = Utils.customDateFormat(start, {separator: " ", hideYear: true, monthFormat: "long"});
        }
        if(end){
            end = Utils.customDateFormat(end, {separator: " ", hideYear: true, monthFormat: "long"});
        }
        if(start){
            result += start;
            if(end && end !== start){
                result += " - " + end;
            }
        }
        if(result) result+= ", "+year;
        return result;
    }

    $scope.highlitedSpeakers = new Set();

    $scope.highlightSpeaker = function(id){
        $scope.highlitedSpeakers.add(id);
    };
    $scope.formatDate = function(date){
        var dateOut = new Date(date);
        return dateOut;
    };

    $scope.removeSpeaker = function(){
      $scope.highlitedSpeakers.clear();
    };

    $scope.isOpen = false;
    $scope.oneAtATime = true;
    $scope.activeDay = null;

    $scope.dayClicked = function (key) {
        if($scope.activeDay){
            if($scope.activeDay===key){
                $scope.activeDay = null;
            }else{
                $scope.activeDay = key;
            }
        }else{
            $scope.activeDay=key;
        }
    };

    $scope.isEmpty=function(myObject) {
        for(var key in myObject) {
            if (myObject.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    };

    $scope.closeModal = function () {
        $state.go('calendar.events.event', {idPathology: 0, id: null}, {}, {reload: true});
        $modalInstance.close();
        $stateParams.id = null;
    };
}]);

app.filterProvider.register("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});