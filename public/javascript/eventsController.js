/**
 * Created by miricaandrei23 on 28.10.2014.
 */
cloudAdminControllers.controller('eventsController', ['$scope','eventsService','$stateParams', function($scope,eventsService,$stateParams){
var date = new Date();
    var y=$(date);
     eventsService.query().$promise.then(function(result){
        $scope.events =result;
         console.log($scope.events);
       $scope.eventsS=[];
       for(var i = 0; i < $scope.events.length; i++)
       {
           $scope.eventsS[i] = {id:$scope.events[i].uuid, title: $scope.events[i].name,start: new Date($scope.events[i].start), end: new Date($scope.events[i].end),allDay: false, color: 'green',className: 'events'};
       }
        $scope.realEvents=[$scope.eventsS];
        $scope.uiConfig = {
            calendar:{
                eventSources:$scope.realEvents,
                height: 450,
                editable: true,
                header:{
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
            }
        }
    }});
    eventsService.query().$promise.then(function(result) {
        $scope.events2 = result;
        $scope.events2Filtered = [];
        for (var i = 0; i < $scope.events2.length; i++) {
            if (new Date($scope.events2[i].start).getMonth() + 1 >= date.getMonth() + 1 && (new Date($scope.events2[i].start).getFullYear() == date.getFullYear()))
                $scope.events2Filtered.push($scope.events2[i]);
        }
    });
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
