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
            var allCollapsed = false; // all dates appear collapsed by default; if true, dates that
                                    //  have enough available room will be expanded
            scope.hideTodayBoxLine = true;

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
                var ret = [];
                var prevMonth = resp[0]['start'].substr(5,2);
                var thisMonth;
                var idxLuna = 0;
                var leftPx;

                var d = new Date();                   //
                d.setDate(d.getDate()-daysTotal/2);  //  This finds the first day on the grid. I is used as an offset
                d = d.getDate();                    //   for positioning all the dates

                for(var i=0; i<resp.length; i++){
                    thisMonth = resp[i]['start'].substr(5,2);
                    if(thisMonth!=prevMonth){
                        prevMonth = thisMonth;
                        idxLuna++;
                    }

                    leftPx = ((idxLuna*31)+(parseInt(resp[i]['start'].substr(8,2))-d))*gridSize;

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

                console.log(ret);

                var poz = true;
                var currentPoz;
                var nextPoz;
                var availableSpace;

                for(var i=0; i<ret.length; i++){
                    poz = !poz;

                    currentPoz = ret[i].leftPx;
                    if(i+2<ret.length){
                        nextPoz = ret[i+2].leftPx;
                    }else{
                        nextPoz = currentPoz + 300;
                    }

                    availableSpace = nextPoz - currentPoz;

                    ret[i].isDown = poz;
                    if(availableSpace >= 250){
                        ret[i].slim = false;
                        ret[i].collapsed = false||allCollapsed;
                    }else if(availableSpace >= 80){
                        ret[i].slim = false;
                        ret[i].collapsed = true||allCollapsed;
                    }else{
                        ret[i].slim = true;
                        ret[i].collapsed = true||allCollapsed;
                    }
                }

                scope.formatEvents = ret;
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