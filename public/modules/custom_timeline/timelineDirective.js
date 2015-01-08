/**
 * Created by andrei on 08.01.2015.
 */

//TODO: Angularize this old jQuery code

var scripts = document.getElementsByTagName("script")
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

            scope.timelineHtml = $sce.trustAsHtml("");

            //------------------------------------------------------------------------------------------------------- CUSTOMIZE
            var timeBoxTop = 50;
            var timeBoxTopWhenFlipped = 150;
            var gridLength = 1200;
            var daysTotal = 80;
            var allCollapsed = true;
            var gridSize = gridLength / daysTotal;

            var evenimente = "";
            var listaEvenimente = "";
            var gridHTML = "";


            scope.$watch('loadEvents', function (loadedEvents) {
                if(loadedEvents){
                    events=loadedEvents;
                    //console.log(events);
                    if(months){
                        renderAll();
                    }
                }
            });

            scope.$watch('loadMonths', function (loadedMonths) {
                if(loadedMonths){
                    months=loadedMonths;
                    //console.log(months);
                    if(events){
                        renderAll();
                    }
                }
            });

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

                return ret;
            };

            var timeBox = function(evenimentLista, id, collapsed, isDown, leftPx){
                var collapsedContent = collapsed?'<i class="glyphicon glyphicon-chevron-down"></i>':'<i class="glyphicon glyphicon-chevron-right"></i>';
                var hidden = collapsed?" hide":"";
                var style = "";
                var lineBottom = isDown?"bottom:40px;":"bottom:-15px;";
                style += 'margin-left:'+leftPx.toString()+'px;margin-top:'+(isDown?timeBoxTopWhenFlipped:timeBoxTop).toString()+'px;z-index:'+(999-id)+';';
                //console.log(style);
                var ret = '<div class="timeBox" onclick="toggleT1(this)" id="timeBox'+id+'" style='+style+'><div class="timeBoxLine" style="'+lineBottom+'"></div><div class="zi">'+evenimentLista.zi+'</div><div class="luna">.'+evenimentLista.luna+'</div><div class="isCollapsed">'+collapsedContent+'</div><div class="nume'+hidden+'">'+evenimentLista.nume+'</div></div>';
                return ret;
            };

            var timeBox2 = function(evenimentLista, id, collapsed, isDown, leftPx){
                var style = "";
                var lineBottom = isDown?"bottom:27px;":"bottom:-16px;";
                style += 'margin-left:'+leftPx.toString()+'px;margin-top:'+(isDown?timeBoxTopWhenFlipped:timeBoxTop).toString()+'px;z-index:'+(999-id)+';';
                //console.log(style);
                var ret = '<div class="timeBox2" onclick="toggleT2(this)" id="timeBox'+id+'" style='+style+'><div class="timeBoxLine" style="'+lineBottom+'"></div><div class="isCollapsed"><i class="glyphicon glyphicon-chevron-down"></i></div><div class="collapsedContent hide"><div class="zi">'+evenimentLista.zi+'</div><div class="luna">.'+evenimentLista.luna+'</div><div class="nume">'+evenimentLista.nume+'</div></div></div>';
                return ret;
            };

            var alignEvents = function(listaE){           //   for positioning all the dates

                evenimente = "";
                var poz = true;
                var currentPoz;
                var nextPoz;
                var availableSpace;
                var eveniment;

                for(var i=0; i<listaE.length; i++){
                    poz = !poz;

                    currentPoz = listaE[i].leftPx;
                    if(i+2<listaE.length){
                        nextPoz = listaE[i+2].leftPx;
                    }else{
                        nextPoz = currentPoz + 300;
                    }

                    availableSpace = nextPoz - currentPoz;

                    if(availableSpace >= 250){
                        eveniment = timeBox(listaE[i],i,false||allCollapsed,poz,currentPoz);
                    }else{
                        if(availableSpace >= 80){
                            eveniment = timeBox(listaE[i],i,true||allCollapsed,poz,currentPoz);
                        }else{
                            eveniment = timeBox2(listaE[i],i,true||allCollapsed,poz,currentPoz);
                        }
                    }
                    evenimente+=eveniment;
                }
            };

            var alignMonths = function (listaE,jsonM) {
                var firstMonth = new Date().getMonth() - 2;
                if(firstMonth < 0) firstMonth = 12 + firstMonth;
                var firstMonthPoz = listaE[0].leftPx - (parseInt(listaE[0].zi) * 15);
                var m;
                var month;
                var months = "";
                var poz;
                for(var i=0; i<4; i++){
                    poz = i*465 + firstMonthPoz + 15;
                    m = firstMonth+i;
                    if(m>11) m=m-12;
                    month = jsonM[m];
                    month = '<div class="month" style="left:'+poz+'px;"><div class="monthLine"></div><div class="monthName">'+month+'</div></div>';
                    months+=month;
                }
                return months;
            };

            var timeGrid = function(listaE,jsonM){
                var lines;
                var months = alignMonths(listaE,jsonM);
                var todayDay = new Date().getDate().toString();
                var todayMonth = (new Date().getMonth()+1).toString();
                var todayFormat = (todayDay.length<2?"0"+todayDay:todayDay)+"."+(todayMonth.length<2?"0"+todayMonth:todayMonth);
                var todayBox = '<div class="todayBox"><div class="dateShow">'+todayFormat+'</div><div class="arrowDown"></div><div class="lineDown"></div></div>';
                var grid = '<div class="timeGrid"><div class="gridd">'+months+'</div>'+todayBox+'</div>';
                return grid;
            };

            var renderAll = function () {
                listaEvenimente = creazaLista(events);
                gridHTML = timeGrid(listaEvenimente,months);

                alignEvents(listaEvenimente);
                scope.timelineHtml = $sce.trustAsHtml(evenimente+gridHTML);
            };

            //------------------------------------------------------------------------------------------------- CLICK EVENTS

            scope.toggleT1 = function(){
                console.log("t1");
            };

            scope.toggleT2 = function(){
                console.log("t2");
            };

            scope.getDate = function (str) {
                return new Date(str);
            }
        }
    };
}]);

var toggleT1 = function(elem){
    var c = angular.element(angular.element(elem).find('div')[4]);
    var i = angular.element(elem).find('i');
    if(c.hasClass("hide")){
        c.removeClass("hide");
        i.removeClass("glyphicon-chevron-down");
        i.addClass("glyphicon-chevron-right");
    }else{
        c.addClass("hide");
        i.removeClass("glyphicon-chevron-right");
        i.addClass("glyphicon-chevron-down");
    }
};

var toggleT2 = function(elem){
    var c = angular.element(angular.element(elem).find('div')[2]);
    var i = angular.element(elem).find('i');
    if(c.hasClass("hide")){
        c.removeClass("hide");
        i.removeClass("glyphicon-chevron-down");
        i.addClass("glyphicon-chevron-right");
    }else{
        c.addClass("hide");
        i.removeClass("glyphicon-chevron-right");
        i.addClass("glyphicon-chevron-down");
    }
};