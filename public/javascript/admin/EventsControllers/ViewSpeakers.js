controllers.controller('ViewSpeakers', ['$scope', '$state', 'EventsService', 'ngTableParams', '$filter', '$modal', 'ActionModal', 'AmazonService', 'Success', function($scope, $state, EventsService, ngTableParams, $filter, $modal, ActionModal, AmazonService, Success){

    $scope.refreshSpeakers = function () {
        EventsService.speakers.query().$promise.then(function(resp){
            var speakers = Success.getObject(resp);
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    first_name: 'asc'     // initial sorting
                },
                filter: {
                    first_name: ''       // initial filter
                }
            }, {
                total: speakers.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(speakers, params.filter())), params.orderBy());
                    params.total(orderedData.length);
                    if(params.total() < (params.page() -1) * params.count()){
                        params.page(1);
                    }
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };
    $scope.refreshSpeakers();

    $scope.add = function () {
        $modal.open({
            templateUrl: 'partials/admin/content/events/modalEditSpeaker.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'CreateSpeaker'
        });
    };

    $scope.update = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/content/events/modalEditSpeaker.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'UpdateSpeaker',
            resolve: {
                idToUpdate: function () {
                    return id;
                }
            }
        });
    };

    $scope.deleteSpeaker = function (speaker) {
        ActionModal.show("Stergere speaker", "Sunteti sigur ca doriti sa stergeti speaker-ul?", function () {
            EventsService.speakers.delete({id: speaker._id}).$promise.then(function () {
                if(speaker.image_path){
                    AmazonService.deleteFile(speaker.image_path, function () {
                        $scope.refreshSpeakers();
                    });
                }else{
                    $scope.refreshSpeakers();
                }
            }).catch(function () {
                console.log("Eroare la stergere");
            });
        }, "Sterge");
    }

}]);