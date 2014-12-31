/**
 * Created by miricaandrei23 on 25.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('eventsCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','ngTableParams','$filter', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,ngTableParams,$filter){
    EventsAdminService.getAll.query().$promise.then(function(result){
        var events = result;
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                name: 'asc'     // initial sorting
            },
            filter: {
                name: ''       // initial filter
            }
        }, {
            total: events.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(events, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });
    EventsAdminService.getAllRoom.query().$promise.then(function(resp){
        $scope.rooms=resp;
        var listRooms=$scope.rooms;
        $scope.tableParams2 = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                room_name: 'asc'     // initial sorting
            },
            filter: {
                room_name: ''       // initial filter
            }
        }, {
            total: listRooms.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(listRooms, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });

    EventsAdminService.getAllTalks.query().$promise.then(function(resp){
        console.log(resp);
        $scope.talks=resp;
        $scope.tableParamsTalks = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                title: 'asc'     // initial sorting
            },
            filter: {
                title: ''       // initial filter
            }
        }, {
            total: resp.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')($scope.talks, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });

    EventsAdminService.getAllSpeakers.query().$promise.then(function(resp){
        $scope.rooms=resp;
        var listSpeakers=$scope.rooms;
        $scope.tableParamsSpeakers = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                last_name: 'asc'     // initial sorting
            },
            filter: {
                last_name: ''       // initial filter
            }
        }, {
            total: listSpeakers.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(listSpeakers, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

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
