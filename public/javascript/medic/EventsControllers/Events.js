/**
 * Created by miricaandrei23 on 28.10.2014.
 */
controllers.controller('Events', ['$scope','eventsService','$stateParams','$modal','$state','$position','$window','$timeout','$document','$rootScope','$sce','Utils','Diacritics', function($scope,eventsService,$stateParams,$modal,$state,$position,$window,$timeout,$document,$rootScope,$sce,Utils,Diacritics){
var date = new Date();
    $scope.realEvents=[];
    $scope.realEventsMob=[];
    var y=$(date);
    $scope.eventIcon='<i class="glyphicon glyphicon-facetime-video verySmallFont" ng-if="eventim.type==2"></i>&nbsp;';
    $scope.eventIconCalendar='<i class="glyphicon glyphicon-facetime-video verySmallFont"></i>&nbsp;';

    eventsService.calendar.query({specialGroup: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
        $scope.events = result.success;
        $scope.eventsFiltered = [];
        for (var i = 0; i < $scope.events.length; i++) {
            if (new Date($scope.events[i].end) > date)
                $scope.eventsFiltered.push($scope.events[i]);
        }
       $scope.eventsS=[];
        $scope.eventsMob=[];
       for(var i = 0; i < $scope.events.length; i++)
       {
           var today = new Date($scope.events[i].end);
           var tomorrow = new Date($scope.events[i].end);
           tomorrow.setDate(today.getDate()+1);
           $scope.eventsS.push({id:$scope.events[i]._id, title:Diacritics.trimTextAndReplaceDiacritics($scope.events[i].name,false,true),start: new Date($scope.events[i].start), end: today.getHours()===0?tomorrow:today,allDay: false,className: 'events',color: '#01877B', type: Diacritics.trimTextAndReplaceDiacritics($scope.events[i].name,false,false)});
       }
        for(var i = 0; i < $scope.events.length; i++)
        {
            var today = new Date($scope.events[i].end);
            var tomorrow = new Date($scope.events[i].end);
            tomorrow.setDate(today.getDate()+1);
            $scope.eventsMob.push({id:$scope.events[i]._id, title:Diacritics.trimTextAndReplaceDiacritics($scope.events[i].name,true,true),start: new Date($scope.events[i].start), end: today.getHours()===0?tomorrow:today,allDay: false,className: 'events',color: '#01877B', type: Diacritics.trimTextAndReplaceDiacritics($scope.events[i].name,false,false)});
        }

         $scope.realEvents=[$scope.eventsS];
        $scope.realEventsMob=[$scope.eventsMob];
         $scope.eventRender = function(data, event, view){
              angular.element('.fc-event-hori').attr("data-toggle","popover");
             angular.element('.fc-event-hori').attr("data-content",data.type);
             var today = new Date(data.end);
             var tomorrow = new Date(data.end);
             tomorrow.setDate(today.getDate()-1);
             if(today.getHours()===0)
                var endDate=tomorrow;
             else
                 var endDate=today;
             angular.element('.fc-event-hori').attr("data-original-title",Utils.customDateFormat(data.start)  + " - " +  Utils.customDateFormat(endDate));

             var options = {
                 trigger:"hover",
                 placement:'auto',
                 container:'body',
                 delay: 500
             };
                 $('[data-toggle="popover"]').popover(options);
         };
        $scope.uiConfig = {
            calendar: {
                eventSources: $scope.realEvents,
                height: 400,
                editable: false,
                header: {
                    left: 'month basicWeek basicDay',
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
                        controller: 'EventModal',
                        resolve:{
                            idEvent: function () {
                                return event._id;
                            }
                        }
                    });
                }

     }};
        $scope.uiConfigMobile = {
            calendar: {
                eventSources: $scope.realEventsMob,
                height: 400,
                editable: false,
                header: {
                    left: 'month basicWeek basicDay',
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
                        controller: 'EventModal',
                        resolve:{
                            idEvent: function () {
                                return event._id;
                            }
                        }
                    });
                }

            }};
         if($stateParams.id)
         {
             angular.element($document).ready(function(){
                 $scope.goToEvent($stateParams.id);
             });
         }
     });
    $scope.goToEvent=function(eventId) {
        $modal.open({
            templateUrl: 'partials/medic/calendarDetails.ejs',
            backdrop: true,
            size: 'lg',
            windowClass: 'fade',
            controller: 'EventModal',
            resolve:{
                idEvent: function () {
                    return eventId;
                }
            }
        });
    };
}])
    .filter("asDate", function () {
        return function (input) {
            return new Date(input);
        }
    });
