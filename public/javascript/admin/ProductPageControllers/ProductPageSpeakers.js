controllers.controller('ProductPageSpeakers', ['$scope', 'SpecialProductsService', 'ngTableParams', '$filter', 'Success', 'Error', function($scope, SpecialProductsService, ngTableParams, $filter, Success, Error) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    //get all speakers
    SpecialProductsService.speakers.query().$promise.then(function (resp) {
        $scope.allSpeakers = Success.getObject(resp);
    }).catch(function(err){
        $scope.resetAlert("danger", Error.getMessage(err.data));
    });

    //get selected speakers
    var refreshTable = function () {
        SpecialProductsService.speakers.query({product: $scope.sessionData.idToEdit}).$promise.then(function (resp) {
                var data = Success.getObject(resp);
                //console.log(data);
                $scope.tableParams = new ngTableParams({
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
        }).catch(function(err){
            $scope.resetAlert("danger", Error.getMessage(err.data));
        });
    };

    refreshTable();

    $scope.addSpeaker = function () {
        var speaker = this.selectedSpeaker;
        var product_id = $scope.sessionData.idToEdit;
        if(speaker && speaker._id && product_id){
            SpecialProductsService.speakers.create({product_id: product_id, speaker_id: speaker._id}).$promise.then(function (resp) {
                refreshTable();
            }).catch(function(err){
                $scope.resetAlert("danger", Error.getMessage(err.data));
            });
        }
    };

    $scope.removeSpeaker = function (speaker) {
        //console.log(speaker);
        var product_id = $scope.sessionData.idToEdit;
        if(speaker && speaker._id && product_id){
            SpecialProductsService.speakers.delete({product_id: product_id, speaker_id: speaker._id}).$promise.then(function (resp) {
                refreshTable();
            }).catch(function(err){
                $scope.resetAlert("danger", Error.getMessage(err.data));
            });
        }
    };

}]);