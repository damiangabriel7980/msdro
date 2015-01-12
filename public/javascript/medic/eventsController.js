/**
 * Created by miricaandrei23 on 28.10.2014.
 */
cloudAdminControllers.controller('eventsController', ['$scope','eventsService','$stateParams','$modal','$state', function($scope,eventsService,$stateParams,$modal,$state){
var date = new Date();
    $scope.realEvents=[];
    var y=$(date);
     eventsService.query().$promise.then(function(result){
        $scope.events =result;
         console.log($scope.events);
       $scope.eventsS=[];
       for(var i = 0; i < $scope.events.length; i++)
       {
           $scope.eventsS.push({id:$scope.events[i]._id, title: $scope.events[i].name,start: new Date($scope.events[i].start), end: new Date($scope.events[i].end),allDay: false,className: 'events',color: '#009d97'});
       }

         $scope.realEvents=[$scope.eventsS];
         $scope.eventRender = function(data, event, view){

             $('.fc-event-inner').attr('title',data.title);
             $('.fc-event-inner').tooltip({text:data.title});
         }
        $scope.uiConfig = {
            calendar: {
                eventSources: $scope.realEvents,
                height: 450,
                editable: false,
                header: {
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                eventMouseover: $scope.eventRender,
                eventClick:function(event){
                    $modal.open({
                        templateUrl: 'partials/medic/calendarDetails.ejs',
                        backdrop: true,
                        size: 'lg',
                        windowClass: 'fade',
                        controller: 'modalCtrl',
                        resolve:{
                            idEvent: function () {
                                return event._id;
                            }
                        }
                    });
                }

     }}})
    ;
    eventsService.query().$promise.then(function(result) {
        $scope.events2 = result;
        $scope.events2Filtered = [];
        for (var i = 0; i < $scope.events2.length; i++) {
            if (new Date($scope.events2[i].start).getMonth() + 1 >= date.getMonth() + 1 && (new Date($scope.events2[i].start).getFullYear() == date.getFullYear()))
                $scope.events2Filtered.push($scope.events2[i]);
        }
    });
    $scope.goToEvent=function(eventId) {
        $modal.open({
            templateUrl: 'partials/medic/calendarDetails.ejs',
            backdrop: true,
            size: 'lg',
            windowClass: 'fade',
            controller: 'modalCtrl',
            resolve:{
                idEvent: function () {
                    return eventId;
                }
            }
        });
    };
    if($stateParams.data.id)
    {
        $modal.open({
            templateUrl: 'partials/medic/calendarDetails.ejs',
            backdrop: true,
            size: 'lg',
            windowClass: 'fade',
            controller: 'modalCtrl',
            resolve:{
                idEvent: function () {
                    return $stateParams.data.id;
                }
            }
        });
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
