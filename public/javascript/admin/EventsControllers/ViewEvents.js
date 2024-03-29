controllers.controller('ViewEvents', ['$scope', '$state', 'EventsService', 'ngTableParams', '$filter', '$modal', 'ActionModal', 'AmazonService', 'Success', '$state', function($scope, $state, EventsService, ngTableParams, $filter, $modal, ActionModal, AmazonService, Success, $state){

    var refreshEvents = function (sortByDate) {
        EventsService.events.query().$promise.then(function(resp){
            var events = Success.getObject(resp);
            var params = {
                page: 1,            // show first page
                count: 10,          // count per page
                //initalSorting
                sorting: {
                    last_updated: 'desc'     // initial sorting
                },
                filter: {
                    name: ''       // initial filter
                }
            };
            if(sortByDate){
                params.sorting = {last_updated: 'desc'};
            }
            $scope.tableParams = new ngTableParams(params, {
                total: events.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(events, params.filter())), params.orderBy());
                    $scope.resultData = orderedData;
                    params.total(orderedData.length);
                    if(params.total() < (params.page() -1) * params.count()){
                        params.page(1);
                    }
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };
    refreshEvents();

    $scope.selectedItems = new Set();

    $scope.addToSelectedItems = function(id){
        if($scope.selectedItems.has(id)){
            $scope.selectedItems.delete(id)
        } else {
            $scope.selectedItems.add(id);
        }
    };
    $scope.checkValue = function(id){
        if($scope.selectedItems.has(id)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.addEvent = function () {
        EventsService.events.create({
            name: "untitled",
            start: Date.now(),
            end: Date.now()
        }).$promise.then(function () {
                refreshEvents(true);
            });
    };

    $scope.toggleEventEnable = function (id, enable) {
        ActionModal.show(
            enable?"Dezactiveaza eveniment":"Activeaza eveniment",
            enable?"Sunteti sigur ca doriti sa dezactivati evenimentul?":"Sunteti sigur ca doriti sa activati evenimentul?",
            function () {
                EventsService.events.update({id: id}, {enable: !enable}).$promise.then(function () {
                    refreshEvents();
                });
            },{
                yes: "Da"
            }
        );
    };

    $scope.editEvent = function(id){
        $state.go('content.events.editEvent', {idEvent: id});
    };

    $scope.deleteEvent = function (event) {
        ActionModal.show("Stergere eveniment", "Sunteti sigur ca doriti sa stergeti evenimentul?", function () {
            var conferencesIds = event.listconferences || [];
            async.parallel([
                function (callbackParallel) {
                    //remove all pictures for each conference
                    async.each(conferencesIds, function (conferenceID, callbackEach) {
                        AmazonService.deleteFilesAtPath("conferences/"+conferenceID, function (err, success) {
                            if(err){
                                console.log(err);
                                callbackEach("Eroare la stergerea fisierelor");
                            }else{
                                callbackEach();
                            }
                        });
                    }, function (err) {
                        if(err){
                            callbackParallel(err);
                        }else{
                            callbackParallel();
                        }
                    });
                },
                function (callback) {
                    //remove this event
                    EventsService.events.delete({id: event._id}).$promise.then(function (resp) {
                        callback();
                    }).catch(function () {
                        callback("Eroare la stergerea evenimentului");
                    });
                }
            ], function (err) {
                var status;
                if(err){
                    status = err;
                }else{
                    status = "Evenimentul a fost sters";
                }
                ActionModal.show("Stergere eveniment", status, function () {
                    refreshEvents();
                });
            });
        },{
            yes: "Da"
        });
    };

}]);