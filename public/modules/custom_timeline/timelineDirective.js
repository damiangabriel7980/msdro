/**
 * Created by andrei on 08.01.2015.
 */

//TODO: Angularize this old jQuery code

var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length-1].src;

angular.module('msdTimeline', []).directive('ngMsdTimeline', ['$sce', function($sce) {
    return {
        restrict: 'E',
        templateUrl: currentScriptPath.replace('timelineDirective.js', 'timelineTemplate.html'),
        scope: {
            loadEvents: '=events',
            loadMonths: '=months'
        },
        link: function(scope, element, attrs) {
            var events = null;
            var months = null;

            scope.timeBoxTop = 40;
            scope.timeBoxTopWhenFlipped = 135;
            var gridLength = 1200;
            var daysTotal = 80;
            var gridSize = gridLength / daysTotal;

            //customize:
            var allCollapsed = true; // all dates appear collapsed by default; if true, dates that
                                    //  have enough available room will be expanded

            scope.hideTodayBoxLine = true;

            var removeExpandingBeyond = true; //remove events that expand beyond the grid width

            scope.$watch('loadEvents', function (loadedEvents) {
                if(loadedEvents){
                    events=loadedEvents;
                    creazaLista(loadedEvents);
                }
            });

            scope.$watch('loadMonths', function (loadedMonths) {
                if(loadedMonths){
                    months=loadedMonths;
                    alignMonths(loadedMonths);
                }
            });

            scope.thisMonth = new Date().getMonth();
            scope.thisDay = new Date().getDate();

            var creazaLista = function(resp){
                console.log(resp);
                var ret = [];
                var prevMonth = resp[0]['start'].substr(5,2);
                var thisMonth;
                var idxLuna = 0;
                var leftPx;

                var firstDate = new Date();
                firstDate.setDate(firstDate.getDate()-daysTotal/2);  //  This finds the first date on the grid

                idxLuna = new Date(resp[0]['start']).getMonth() - firstDate.getMonth(); // Gets the difference in months between the first month
                if(idxLuna < 0) idxLuna = 12 + idxLuna;                                // on the grid and the first month in our response

                var dayOffset = firstDate.getDate();

                for(var i=0; i<resp.length; i++){
                    thisMonth = resp[i]['start'].substr(5,2);
                    if(thisMonth!=prevMonth){
                        prevMonth = thisMonth;
                        idxLuna++;
                    }

                    leftPx = ((idxLuna*31)+(parseInt(resp[i]['start'].substr(8,2))-dayOffset))*gridSize;

                    ret.push({
                        nume: resp[i]['name'],
                        start: resp[i]['start'],
                        stop: resp[i]['end'],
                        luna: resp[i]['start'].substr(5,2),
                        zi: resp[i]['start'].substr(8,2),
                        idxLuna: idxLuna,
                        leftPx: leftPx
                    });
                }

                var poz = true;
                var currentPoz;
                var nextPoz;
                var availableSpace;

                var finalList = [];

                for(var i=0; i<ret.length; i++){

                    //alternatively place a box up or down
                    poz = !poz;
                    ret[i].isDown = poz;

                    currentPoz = ret[i].leftPx;
                    if(i+2<ret.length){
                        nextPoz = ret[i+2].leftPx;
                    }else{
                        nextPoz = currentPoz + 300;
                    }

                    //calculates available space on the grid in pixels
                    availableSpace = nextPoz - currentPoz;

                    //grid has 1200 pixels (each day has 15 pixels)

                    if(availableSpace >= 250){
                        //every expanded box has a width of 250 pixels
                        ret[i].slim = false;
                        ret[i].collapsed = false||allCollapsed;
                    }else if(availableSpace >= 80){
                        //a normal collapsed box has a width of 80 pixels
                        ret[i].slim = false;
                        ret[i].collapsed = true||allCollapsed;
                    }else{
                        //a slim collapsed box has a width of 15 pixels
                        ret[i].slim = true;
                        ret[i].collapsed = true||allCollapsed;
                    }

                    //remove boxes that expand beyond the grid if decided so
                    //grid = 1200px
                    //box = 250px
                    //1200 - 250 = 950px
                    if(ret[i].leftPx < 950 && removeExpandingBeyond){
                        finalList.push(ret[i]);
                    }
                }

                scope.formatEvents = finalList;
            };

            var alignMonths = function (monthNames) {
                var thisMonth = scope.thisMonth;
                var thisMonthPoz = 600 - (scope.thisDay * 15) + 15;
                var firstMonth = thisMonth - 2;
                var firstMonthPoz = thisMonthPoz - (2 * 465);

                var ret = [];
                for(var i=0; i<=4; i++){
                    var m = firstMonth+i;
                    if(m < 0)  m = 12 + m;
                    if(m > 11) m = m - 12;
                    ret.push({
                        poz: firstMonthPoz + (i*465),
                        name: monthNames[m]
                    });
                }

                scope.formatMonths = ret;
            };
        }
    };
}]);