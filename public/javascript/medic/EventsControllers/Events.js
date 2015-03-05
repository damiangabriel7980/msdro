/**
 * Created by miricaandrei23 on 28.10.2014.
 */
controllers.controller('Events', ['$scope','eventsService','$stateParams','$modal','$state','$position','$window','$timeout','$document','$rootScope','$sce', function($scope,eventsService,$stateParams,$modal,$state,$position,$window,$timeout,$document,$rootScope,$sce){
var date = new Date();
    $scope.realEvents=[];
    var y=$(date);
    $scope.trustAsHtml = function (data) {
        var newName=$sce.trustAsHtml(data);
        return newName;
    };
    $scope.eventIcon='<i class="glyphicon glyphicon-facetime-video verySmallFont" ng-if="eventim.type==2"></i>&nbsp;';
    $scope.eventIconCalendar='<i class="glyphicon glyphicon-facetime-video verySmallFont"></i>&nbsp;';

    $scope.convertAndTrustAsHtml=function (data) {
        var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        return $sce.trustAsHtml(convertedText);
    };
    eventsService.query({specialGroup: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
        $scope.events =result;
       $scope.eventsS=[];
       for(var i = 0; i < $scope.events.length; i++)
       {
           var today = new Date($scope.events[i].end);
           var tomorrow = new Date($scope.events[i].end);
           tomorrow.setDate(today.getDate()+1);
           $scope.eventsS.push({id:$scope.events[i]._id, title:trimTitle($scope.events[i].name),start: new Date($scope.events[i].start), end: today.getHours()===0?tomorrow:today,allDay: false,className: 'events',color: '#006d69', type: popOverTitle($scope.events[i].name)});
       }

         $scope.realEvents=[$scope.eventsS];
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
             angular.element('.fc-event-hori').attr("data-original-title",newDate(data.start)  + " - " +  newDate(endDate));

             var options = {
                 trigger:"hover",
                 placement:'auto',
                 container:'body',
                 delay: 500
             };
             //options.title=newDate(data.start)  + " - " + newDate(data.end);
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
         if($stateParams.id)
         {
             angular.element($document).ready(function(){
                 $modal.open({
                     templateUrl: 'partials/medic/calendarDetails.ejs',
                     backdrop: true,
                     size: 'lg',
                     windowClass: 'fade',
                     controller: 'EventModal',
                     resolve:{
                         idEvent: function () {
                             return $stateParams.id;
                         }
                     }
                 });
             });
         }
     })
    ;
    eventsService.query({specialGroup: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result) {
        $scope.events2 = result;
        $scope.events2Filtered = [];
        for (var i = 0; i < $scope.events2.length; i++) {
            if (new Date($scope.events2[i].end) > date)
                $scope.events2Filtered.push($scope.events2[i]);
        }
        console.log($scope.events2Filtered);
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
    var newDate=function(input){
        var data = input;
        return data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear();
    };
    var trimTitle=function(str) {
        var newEventName=String(str)
            .replace('Ă','A')
            .replace('ă','a')
            .replace('Â','A')
            .replace('â','a')
            .replace('Î','I')
            .replace('î','i')
            .replace('Ș','S')
            .replace('ș','s')
            .replace('Ş','S')
            .replace('ş','s')
            .replace('Ț','T')
            .replace('ț','t')
            .replace('Ţ','T')
            .replace('ţ','t');
        newEventName=newEventName.split(/\s+/).slice(0,3).join(" ");
        return newEventName;
    };
    var popOverTitle=function(str) {
        var newEventName=String(str)
            .replace('Ă','A')
            .replace('ă','a')
            .replace('Â','A')
            .replace('â','a')
            .replace('Î','I')
            .replace('î','i')
            .replace('Ș','S')
            .replace('ș','s')
            .replace('Ş','S')
            .replace('ş','s')
            .replace('Ț','T')
            .replace('ț','t')
            .replace('Ţ','T')
            .replace('ţ','t');
        return newEventName;
    };

}])
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').replace(/&acirc;/g,'â').replace(/&icirc;/g,'î').replace(/&#351;/g,'ş').replace(/&Acirc;/g,'Â').replace(/&Icirc;/g,'Î');
        }
    })
    .filter("asDate", function () {
        return function (input) {
            return new Date(input);
        }
    });
