/**
 * Created by miricaandrei23 on 28.10.2014.
 */
cloudAdminControllers.controller('eventsController', ['$scope','eventsService','$stateParams','$modal','$state','$position','$window','$timeout', function($scope,eventsService,$stateParams,$modal,$state,$position,$window,$timeout){
var date = new Date();
    $scope.realEvents=[];
    var y=$(date);
     console.log($stateParams);
     eventsService.query().$promise.then(function(result){
        $scope.events =result;
       $scope.eventsS=[];
       for(var i = 0; i < $scope.events.length; i++)
       {
           var today = new Date($scope.events[i].end);
           var tomorrow = new Date($scope.events[i].end);
           tomorrow.setDate(today.getDate()+1);
           $scope.eventsS.push({id:$scope.events[i]._id, title: $scope.trimTitle($scope.events[i].name),start: new Date($scope.events[i].start), end: tomorrow ,allDay: false,className: 'events',color: '#006d69', type: $scope.events[i].name});
       }

         $scope.realEvents=[$scope.eventsS];
         $scope.eventRender = function(data, event, view){
              angular.element('.fc-event-hori').attr("data-toggle","popover");
             angular.element('.fc-event-hori').attr("data-content",data.type);
             //console.log(data);
             var options = {
                 'title':$scope.newDate(data.start)  + " - " + $scope.newDate(data.end),
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
                height: 450,
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
                        controller: 'modalCtrl',
                        resolve:{
                            idEvent: function () {
                                return event._id;
                            }
                        }
                    });
                }

     }}
     })
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
    angular.element('.fc-button-next').on('click',function(){
        var margin = Math.floor(angular.element($window).height() - angular.element(".main-view-container").outerHeight() - angular.element('#footer').outerHeight());
        angular.element("#footer").css({'margin-top': (margin > 0 ? margin : 10)});
    });
    angular.element('.fc-button-prev').on('click',function(){
        var margin = Math.floor(angular.element($window).height() - angular.element(".main-view-container").outerHeight() - angular.element('#footer').outerHeight());
        angular.element("#footer").css({'margin-top': (margin > 0 ? margin : 10)});
    });
    $scope.newDate=function(input){
        var data = new Date(input);
        return data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear();
    };
    $scope.trimTitle=function(str) {
        return str.split(/\s+/).slice(0,3).join(" ");
    };
    if($stateParams.id)
    {
        $timeout(function(){
        $modal.open({
            templateUrl: 'partials/medic/calendarDetails.ejs',
            backdrop: true,
            size: 'lg',
            windowClass: 'fade',
            controller: 'modalCtrl',
            resolve:{
                idEvent: function () {
                    return $stateParams.id;
                }
            }
        });
    },150);
    }
}])
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').replace(/&acirc;/g,'â').replace(/&icirc;/g,'î').replace(/&#351;/g,'ş');
        }
    })
    .filter("asDate", function () {
        return function (input) {
            return new Date(input);
        }
    });
