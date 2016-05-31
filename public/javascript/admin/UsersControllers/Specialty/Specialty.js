controllers.controller('Specialty', ['$scope', '$state', '$sce', 'ngTableParams', '$filter', '$modal', 'ActionModal', '$q', 'Success','ManageSpecialtyService', 'Error', function ($scope, $state, $sce, ngTableParams, $filter, $modal, ActionModal, $q, Success,ManageSpecialtyService, Error) {

    $scope.addSpecialty = addSpecialty;
    $scope.editSpecialty = editSpecialty;
    $scope.deleteSpecialty = deleteSpecialty;
    $scope.addToSelectedItems = addToSelectedItems;
    $scope.checkValue = checkValue;

    function addSpecialty(){
        ManageSpecialtyService.specialty.save().$promise.then(function(res){
            refreshTable();
        }).catch(function(err){
            console.log(Error.getMessage(err))
        })
    }
    function refreshTable() {
        ManageSpecialtyService.specialty.query().$promise.then(function(result){
            $scope.specialities = Success.getObject(result);
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
                total: $scope.specialities.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')($scope.specialities, params.filter())), params.orderBy());
                    params.total(orderedData.length);
                    $scope.resultData = orderedData;
                    if(params.total() < (params.page() -1) * params.count()){
                        params.page(1);
                    }
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    }
    function editSpecialty(specialty) {
        $modal.open({
            templateUrl: 'partials/admin/users/Specialty/editSpecialty.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'EditSpecialtyController',
            resolve: {
                specialty: function () {
                    return specialty;
                }

            }
        });
    };
    function deleteSpecialty(specialty){
        ActionModal.show('Stergere specialitate','Sunteti sigur ca doriti sa stergeti aceasta specialitate?',function(){
            ManageSpecialtyService.specialty.delete({id: specialty._id}).$promise.then(function(res){
                refreshTable();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            })
        },{
            yes: 'Sterge'
        })
    }
    $scope.selectedItems = new Set();

    function addToSelectedItems(id){
        if($scope.selectedItems.has(id)){
            $scope.selectedItems.delete(id)
        } else {
            $scope.selectedItems.add(id);
        }
    }
    function checkValue(id){
        if($scope.selectedItems.has(id)) {
            return true;
        } else {
            return false;
        }
    }
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    refreshTable()
}]);
