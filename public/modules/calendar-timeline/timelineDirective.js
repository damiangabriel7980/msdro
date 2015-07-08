/**
 * Created by andrei on 08.01.2015.
 */

(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath;
    for(var i=0; i<scripts.length; i++){
        if(scripts[i].src.indexOf("calendar-timeline") > -1) currentScriptPath = scripts[i].src;
    }

    angular.module('calendarTimeline', []).directive('calendarTimeline', ['$sce', function($sce) {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('timelineDirective.js', 'timelineTemplate.html'),
            scope: {
                events: '=',
                months: '=',
                dateAttr: '@',
                nameAttr: '@',
                dayWidth: '=',
                eventSafetyMargin: '=',
                showTodayBoxLine: '='
            },
            link: function(scope, element, attrs) {

                //========================== useful functions
                var resetTimeInDate = function (date) {
                    return new Date(date.setHours(12,0,0,0));
                };

                var oneDay = 24*60*60*1000;
                var daysBetweenDates = function (firstDate, secondDate) {
                    return Math.round((firstDate.getTime() - secondDate.getTime())/(oneDay));
                };

                scope.toDate = function (dateStr) {
                    return new Date(dateStr);
                };

                var addDaysToDate = function (date, days) {
                    var myDate = new Date(date);
                    myDate.setDate(myDate.getDate() + days);
                    return myDate;
                };

                scope.dayDisplay = function (date) {
                    var day = date.getDate();
                    return day<10?"0"+day:day;
                };

                scope.monthDisplay = function (date) {
                    var month = date.getMonth() + 1;
                    return month<10?"0"+month:month
                };

                //========================== initialize vars / constants
                const today = resetTimeInDate(new Date());
                scope.today = today;
                const gridLinesCount = 80;
                const maxEventLength = 250;
                var gridsAllowed = 0;

                //===================================================== events function

                var orderEvents = function () {
                    var ordered = false;
                    var temp;
                    while(!ordered){
                        ordered = true;
                        for(var i=0; i<scope.events.length - 1; i++){
                            if(scope.events[i+1] && scope.events[i][scope.dateAttr] > scope.events[i+1][scope.dateAttr]){
                                temp = scope.events[i];
                                scope.events[i] = scope.events[i+1];
                                scope.events[i+1] = temp;
                                ordered = false;
                            }
                        }
                    }
                };

                var addEventsProperties = function () {
                    for(var i=0; i<scope.events.length; i++){
                        //create an offset based on the difference in days between today and this event's start date
                        var eventDate = resetTimeInDate(new Date(scope.events[i][scope.dateAttr]));
                        scope.events[i].positionOffset = daysBetweenDates(eventDate, today);
                        //decide whether to place this event above or below the time grid
                        scope.events[i].isBelow = i % 2;
                        //calculate the space (in grid units) between two events placed on the same side of the time grid (defaults to 30)
                        scope.events[i].gridUnitsAvailable = 30;
                        if(i-2 >= 0){
                            scope.events[i-2].gridUnitsAvailable = scope.events[i].positionOffset - scope.events[i-2].positionOffset;
                        }
                    }
                };

                var generateTimeGrid = function () {
                    var g = gridLinesCount / 2;
                    scope.timeGrid = [];
                    for(var i=g; i>-1*g; i--){
                        var thisDate = addDaysToDate(today, i);
                        var obj = {
                            offset: i,
                            contrastColor: thisDate.getMonth() % 2
                        };
                        if(thisDate.getDate() === 1){
                            obj.data = scope.months[thisDate.getMonth()];
                        }
                        scope.timeGrid.push(obj);
                    }
                };

                scope.isCompact = function (event) {
                    return event.gridUnitsAvailable * scope.dayWidth < maxEventLength;
                };

                scope.isInBounds = function (offset, safetyMargin) {
                    if(offset > 0) offset++;
                    offset = Math.abs(offset);
                    if(safetyMargin) offset += safetyMargin;
                    return offset <= gridsAllowed;
                };

                //====================================================== watch events input
                scope.$watch('events', function () {
                    if(scope.events && scope.events[0]){
                        //console.log(scope.events);
                        orderEvents();
                        init();
                    }
                });

                //===================================================== initialize
                var init = function () {
                    addEventsProperties();
                    //console.log(scope.events);
                    generateTimeGrid();
                };

                //==================================================== resize
                var resize = function () {
                    var timeline = angular.element(element[0].children[0]);
                    var timelineWidth = timeline[0].offsetWidth;
                    gridsAllowed = parseInt(timelineWidth / scope.dayWidth / 2);
                    //console.log(gridsAllowed);
                };
                angular.element(window).bind('resize', function () {
                    resize();
                });
                angular.element(document).ready(function () {
                    resize();
                });
                scope.$watch('dayWidth', function () {
                    resize();
                });
            }
        };
    }]);
})();