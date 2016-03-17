controllers.controller('ViewDevicesDPOC', ['$scope', '$state', 'DPOCService', 'ngTableParams', '$filter', '$modal', 'InfoModal', 'ActionModal', 'Success', "Utils", 'exportCSV', function ($scope, $state, DPOCService, ngTableParams, $filter, $modal, InfoModal, ActionModal, Success, Utils, exportCSV) {
    $scope.csv = {
        filename: "DPOC_devices_" + Utils.customDateFormat(new Date(), {separator:'-'}) + '.csv',
        rows: []
    };

    $scope.getHeader = function () {
        return ['name', 'email']
    };

    var refreshDevices = function (sortByDate) {
        DPOCService.devices.query().$promise.then(function(resp){
            var devices = Success.getObject(resp);
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
            $scope.csv.rows = exportCSV.formatArrayCSV(devices, ['name', 'email']);
            $scope.tableParams = new ngTableParams(params, {
                total: devices.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(devices, params.filter())), params.orderBy());
                    $scope.resultData = orderedData;

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };
    refreshDevices();
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

    $scope.addDevice = function () {
        $modal.open({
            templateUrl: 'partials/admin/applications/DPOC/modalEditDevice.html',
            windowClass: 'fade',
            controller: 'AddDeviceDPOC'
        });
    };

    $scope.removeDevice = function (id) {
        ActionModal.show("Stergere device", "Sunteti sigur ca doriti sa stergeti device-ul?", function () {
            DPOCService.devices.delete({id: id}).$promise.then(function () {
                $state.reload();
            });
        },{
            yes:"Sterge"
        });
    };

    var parseCSV = function (contents) {
        //CSV config
        var separator = ",";
        var headers = ["name", "email"];

        //init variables
        var headerPatts = [];
        for(var h=0; h<headers.length; h++){
            headerPatts.push(new RegExp("^"+headers[h]));
        }
        var columnsCount = headerPatts.length;

        //handle errors
        var parseError = function (err) {
            window.alert("Parse error - "+err);
        };

        //begin parse
        var lines = contents.split("\n");
        console.log(lines);
        if(lines && lines[0]){
            var result = [];
            var linesUnprocessed = [];
            for(var i=0; i<lines.length; i++){
                //get line
                var line = lines[i].split(separator);
                //check line lenght
                if(line.length != columnsCount && i!=0) {
                    if(lines[i] != "") linesUnprocessed.push(lines[i]);
                }else if(i==0){
                    //check headers
                    console.log(line);
                    console.log(headerPatts);
                    for(var j=0; j<headerPatts.length; j++){
                        if(!headerPatts[j].test(line[j])) {
                            parseError("headers");
                            return false;
                        }
                    }
                }else{
                    //add to result
                    var lineObj = {};
                    for(var l=0; l < columnsCount; l++){
                        lineObj[headers[l]] = line[l];
                    }
                    result.push(lineObj);
                }
            }
            return {
                headers: headers,
                body: result,
                unprocessed: linesUnprocessed,
                columns: columnsCount
            };
        }else{
            parseError("no lines");
            return false;
        }
    };

    $scope.fileSelected = function ($files, $event){
        if($files && $files[0]){
            var file = $files[0];
            var r = new FileReader();
            r.onload = function(e) {
                var contents = e.target.result;
                var parsedCSV = parseCSV(contents);
                if(parsedCSV){
                    $modal.open({
                        templateUrl: 'partials/admin/applications/DPOC/modalImportDevices.html',
                        windowClass: 'fade',
                        controller: 'ImportDevicesDPOC',
                        resolve: {
                            parsedCSV: function () {
                                return parsedCSV;
                            }
                        }
                    });
                }
            };
            r.readAsText(file);
        }
    }

}]);