controllers.controller('ManageAccounts', ['$scope','ManageAccountsService', '$modal', '$state','$filter', 'ngTableParams', 'ActionModal', 'Success', 'Error', 'Utils', 'exportCSV', function($scope, ManageAccountsService, $modal, $state,$filter,ngTableParams, ActionModal,Success,Error, Utils, exportCSV){

    $scope.csv = {
        filename: "Users_Staywell_" + Utils.customDateFormat(new Date(), {separator:'-'}) + '.csv',
        rows: []
    };

    $scope.getHeader = function () {
        return ['Name', 'Username', 'Telefon', 'Url_imagine', 'Profesie', 'Conferinte', 'Grupuri', 'Arii_terapeutice']
    };

    ManageAccountsService.users.query().$promise.then(function (resp) {
        $scope.data = Success.getObject(resp);
        $scope.csv.rows = exportCSV.formatArrayCSV($scope.data, ['name', 'username','phone', 'image_path'],[{'conferencesID': 'title'}, {'groupsID': 'display_name'}, {'therapeutic-areasID': 'name'}], [{'profession' : 'display_name'}]);
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                username: 'asc'     // initial sorting
            },
            filter: {
                username: ''       // initial filter
            }
        }, {
            total: $scope.data.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')($scope.data, params.filter())), params.orderBy());
                $scope.resultData = orderedData;
                params.total(orderedData.length);
                if(params.total() < (params.page() -1) * params.count()){
                    params.page(1);
                }
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });

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

    $scope.viewUser= function(id){
        $modal.open({
            templateUrl: 'partials/admin/users/viewAccount.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'ViewAccount',
            resolve: {
                idToView: function () {
                    return id;
                }
            }
        });
    };
    $scope.toggleUser= function(id,enabledUser){
        ActionModal.show(
            enabledUser?"Dezactiveaza cont":"Activeaza cont",
            enabledUser?"Sunteti sigur ca doriti sa dezactivati contul?":"Sunteti sigur ca doriti sa activati contul?",
            function () {
                ManageAccountsService.users.update({id: id}, {enabled: !enabledUser}).$promise.then(function (resp) {
                    $state.reload();
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            },{
                yes: "Da"
            }
        );
    }
}]);