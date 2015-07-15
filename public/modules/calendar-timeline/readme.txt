Features:

- fully customisable design
- input events in any form
- responsive design
- zoom in/out


Usage:

<calendar-timeline events="events" months="monthsArray" date-attr="start" name-attr="name"
                   day-width="15" event-safety-margin="4" show-today-box-line="false"></calendar-timeline>

Attributes:

- events: array of events to be displayed. ex: [{start: DATE, name: STRING}, {start: ..., name: ...}, ...]
- months: ordered array with the names of each calendar month. ex: ['january', 'february', ...]
- date-attr: attribute of each object in the "events" array that holds the event date. ex: "start"
- name-attr: attribute of each object in the "events" array that holds the event description. ex: "name"
- day width: the number of pixels that each day will occupy on the grid; increase/decrease to zoom in/out; works in real time
- event-safety-margin: input number of grids. the events will disappear from the timeline when they are this many grids near the margin.
- show-today-box-line: show/hide the line below the today box


==================================================================================================================
Zoom example:

On template:
<calendar-timeline events="events" months="monthsArray" date-attr="start" name-attr="name"
                   day-width="dayWidth" event-safety-margin="4" show-today-box-line="false"></calendar-timeline>
<button ng-click="zoomIn()">+</button>
<button ng-click="zoomOut()">-</button>

On controller:
//initialize day width
$scope.dayWidth = 15;
$scope.zoomIn = function(){
    $scope.dayWidth++;
}
$scope.zoomOut = function(){
    $scope.dayWidth--;
}