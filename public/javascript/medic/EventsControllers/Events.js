/**
 * Created by miricaandrei23 on 28.10.2014.
 */
app.controllerProvider.register('Events', ['$scope','eventsService','$stateParams','$modal','$state','$position','$window','$timeout','$document','$rootScope','$sce','Utils','Diacritics', 'Success', 'SpecialFeaturesService', function($scope,eventsService,$stateParams,$modal,$state,$position,$window,$timeout,$document,$rootScope,$sce,Utils,Diacritics,Success,SpecialFeaturesService){
    $scope.eventIcon='<i class="glyphicon glyphicon-facetime-video verySmallFont" ng-if="eventim.type==2"></i>&nbsp;';
    $scope.eventIconCalendar='<i class="glyphicon glyphicon-facetime-video verySmallFont"></i>&nbsp;';

    $scope.eventSources = [];

    SpecialFeaturesService.specialGroups.getSelected().then(function (specialGroupSelected) {
        getContent(specialGroupSelected);
    });

    var getContent = function (specialGroupSelected) {
        eventsService.calendar.query({specialGroup: specialGroupSelected?specialGroupSelected._id.toString():null}).$promise.then(function(result){
            var i;
            var events = Success.getObject(result);
            var eventsFiltered = [];
            var today = new Date();
            for (i=0; i<events.length; i++) {
                if (new Date(events[i].end) > today) eventsFiltered.push(events[i]);
            }
            $scope.eventsFiltered = eventsFiltered;

            var eventsFormatted = [];
            var dateStart;
            var dateEnd;
            for(i=0; i<events.length; i++){
                dateStart = new Date(events[i].start);
                dateEnd = new Date(events[i].end);
                if(dateEnd.getHours()===0) dateEnd.setDate(dateEnd.getDate + 1);
                if(dateEnd.toString()!=="Invalid Date" && dateStart.toString()!=="Invalid Date"){
                    eventsFormatted.push({
                        id: events[i]._id,
                        title: Diacritics.trimTextAndReplaceDiacritics(events[i].name, false, true),
                        start: dateStart,
                        end: dateEnd,
                        allDay: false,
                        className: 'events',
                        color: '#01877B',
                        type: Diacritics.trimTextAndReplaceDiacritics(events[i].name, false, false)
                    });
                }
            }

            var calendarConfig = {
                calendar: {
                    events: eventsFormatted,
                    height: 420,
                    editable: false,
                    header: {
                        left: Utils.isMobile()?'':'month basicWeek basicDay',
                        center: 'title',
                        right: Utils.isMobile()?'prev,next':'today prev,next'
                    },
                    timeFormat: '',
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

                }
            };
            if(!Utils.isMobile()){
                calendarConfig.calendar.eventMouseover = addPopover
            }
            $scope.uiConfig = calendarConfig;

            function addPopover (data, event, view){
                var element = angular.element(event.currentTarget);
                element.attr("data-toggle", "popover");
                element.attr("data-content", data.type);
                var endDate = new Date(data.end);
                if(endDate.getHours()===0) endDate.setDate(endDate.getDate()-1);
                element.attr("data-original-title", Utils.customDateFormat(new Date(data.start))  + " - " +  Utils.customDateFormat(endDate));
                $(element[0]).popover({
                    trigger:"hover",
                    placement:'auto',
                    container:'body'
                }).trigger("mouseenter");
            }


            if($stateParams.id){
                angular.element($document).ready(function(){
                    $scope.goToEvent($stateParams.id);
                });
            }
        });
    };

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
}]);
app.filterProvider.register("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});
