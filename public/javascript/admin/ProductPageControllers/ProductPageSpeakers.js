controllers.controller('ProductPageSpeakers', ['$scope', 'SpecialProductsService', 'ngTableParams', '$filter', function($scope, SpecialProductsService, ngTableParams, $filter) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    //get all speakers
    SpecialProductsService.speakers.query().$promise.then(function (resp) {
        $scope.allSpeakers = resp.success;
    });

    //get selected speakers
    var refreshTable = function () {
        SpecialProductsService.speakers.query({product: $scope.sessionData.idToEdit}).$promise.then(function (resp) {
            if(resp.error){
                $scope.resetAlert("danger", "Eroare la gasire speakeri");
            }else{
                console.log(resp);
                var data = resp.resources;
                $scope.resourcesTableParams = new ngTableParams({
                    page: 1,            // show first page
                    count: 10,          // count per page
                    sorting: {
                        last_name: 'asc'     // initial sorting
                    },
                    filter: {
                        last_name: ''       // initial filter
                    }
                }, {
                    total: data.length, // length of data
                    getData: function($defer, params) {

                        var orderedData = $filter('orderBy')(($filter('filter')(data, params.filter())), params.orderBy());

                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });
            }
        });
    };

    refreshTable();

    $scope.addSpeaker = function () {
        console.log(this.selectedSpeaker);
    };

    $scope.removeSpeaker = function (item) {
        console.log("remove speaker");
    };

}]);