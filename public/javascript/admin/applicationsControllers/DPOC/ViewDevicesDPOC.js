controllers.controller('ViewDevicesDPOC', ['$scope', '$state', 'DPOCService', 'ngTableParams', '$filter', '$modal', 'InfoModal', 'ActionModal', function ($scope, $state, DPOCService, ngTableParams, $filter, $modal, InfoModal, ActionModal) {
    var refreshDevices = function (sortByDate) {
        DPOCService.devices.query().$promise.then(function(resp){
            var devices = resp.success;
            var params = {
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    name: 'asc'     // initial sorting
                },
                filter: {
                    name: ''       // initial filter
                }
            };
            $scope.tableParams = new ngTableParams(params, {
                total: devices.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(devices, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };
    refreshDevices();

    $scope.addDevice = function () {
        $modal.open({
            templateUrl: 'partials/admin/applications/DPOC/modalEditDevice.html',
            windowClass: 'fade',
            controller: 'AddDeviceDPOC'
        });
    };

    $scope.editDevice = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/applications/DPOC/modalEditDevice.html',
            windowClass: 'fade',
            controller: 'EditDeviceDPOC',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        });
    };

    $scope.removeDevice = function (id) {
        ActionModal.show("Stergere device", "Sunteti sigur ca doriti sa stergeti device-ul?", function () {
            DPOCService.devices.delete({id: id}).$promise.then(function () {
                $state.reload();
            });
        }, "Sterge");
    };
}]);