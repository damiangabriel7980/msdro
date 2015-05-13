controllers.controller('ImportDevicesDPOC', ['$scope', 'parsedCSV', function ($scope, parsedCSV) {

    $scope.parsedCSV = parsedCSV;

    $scope.importAll = function () {
        console.log(parsedCSV.body);
    }

}]);