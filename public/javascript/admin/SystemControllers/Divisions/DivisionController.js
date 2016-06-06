controllers.controller('DivisionsController', ['$scope', '$rootScope', '$state', '$sce', '$stateParams', '$filter', 'ngTableParams', 'SystemService', '$modal', 'Success', 'DivisionsService', 'Error','ActionModal', function ($scope, $rootScope, $state, $sce, $stateParams, $filter, ngTableParams, SystemService, $modal, Success, DivisionsService, Error, ActionModal) {
    $scope.addDivision = addDivision;
    $scope.editDivision = editDivision;
    $scope.deleteDivision = deleteDivision;
    $scope.renderHtml = renderHtml;
    $scope.addToSelectedItems = addToSelectedItems;
    $scope.checkValue = checkValue;
    function addDivision() {
        DivisionsService.divisions.create({}).$promise.then(function (res) {
            var newDivision = Success.getObject(res);
            $scope.tableParams.data.push(newDivision);
            refreshTable();
        }).catch(function (err) {
            console.log(Error.getMessage(err))
        })
    }

    function editDivision(division) {
        $modal.open({
            templateUrl: 'partials/admin/system/divisions/modalEditDivisions.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'EditDivisionController',
            resolve: {
                division: function () {
                    return division;
                }

            }
        });
    };
    function refreshTable() {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    last_updated: 'desc'     // initial sorting
                },
                filter: {
                    name: ''       // initial filter
                }
            }, {
                total: 0, // length of data
                getData: function ($defer, params) {
                    DivisionsService.divisions.query().$promise.then(function (result) {
                        var divisions = Success.getObject(result);
                        var orderedData = $filter('orderBy')(($filter('filter')(divisions, params.filter())), params.orderBy());
                        $scope.tableParams.data = divisions;
                        params.total(orderedData.length);
                        $scope.resultData = orderedData;
                        if (params.total() < (params.page() - 1) * params.count()) {
                            params.page(1);
                        }
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }).catch(function(err){
                        console.log(Error.getMessage(err))
                    });
                }
            });
    }
    function deleteDivision(division){
        ActionModal.show("Stergere divizie", "Sunteti sigur ca doriti sa stergeti acesta divizie?",function(){
            DivisionsService.divisions.delete({id: division._id}).$promise.then(function(res){
                refreshTable()
            }).catch(function (err) {
                console.log(Error.getMessage(err))
            })
        },{
            yes: "Sterge"
        })
    }
    $scope.selectedItems = new Set();

    function addToSelectedItems(id){
        if($scope.selectedItems.has(id)){
            $scope.selectedItems.delete(id)
        } else {
            $scope.selectedItems.add(id);
        }
    };
    function checkValue(id){
        if($scope.selectedItems.has(id)) {
            return true;
        } else {
            return false;
        }
    };
    function renderHtml(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    refreshTable()

}]);