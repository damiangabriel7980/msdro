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
//        $modal.open({
//            DeviceUrl: 'partials/admin/applications/contractManagement/editDevice.html',
//            size: 'lg',
//            windowClass: 'fade',
//            controller: 'EditDevice',
//            resolve: {
//                idToEdit: function () {
//                    return id;
//                }
//            }
//        });
    };

    $scope.toggleDevice = function (device) {
        ActionModal.show(
            device.isEnabled?"Dezactiveaza device":"Activeaza device",
            device.isEnabled?"Sunteti sigur ca doriti sa dezactivati device-ul?":"Sunteti sigur ca doriti sa activati device-ul?",
            function () {
                DPOCService.devices.update({id: device._id}, {isEnabled: !device.isEnabled}).$promise.then(function (resp) {
                    refreshDevices();
                });
            }
        );
    };

    $scope.editDevice = function (id) {
        //TODO
    };

    $scope.removeDevice = function (id) {
        //TODO
    };
}]);