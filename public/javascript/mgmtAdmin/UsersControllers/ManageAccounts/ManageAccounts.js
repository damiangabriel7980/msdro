controllers.controller('ManageAccounts', ['$scope','ManageAccountsService', '$modal', '$state','$filter', 'ngTableParams', 'ActionModal', 'Success', 'Error', 'Utils', 'exportCSV', function($scope, ManageAccountsService, $modal, $state,$filter,ngTableParams, ActionModal,Success,Error, Utils, exportCSV){

    $scope.csv = {
        filename: "Users_Staywell_" + Utils.customDateFormat(new Date(), {separator:'-'}) + '.csv',
        rows: []
    };

    $scope.getHeader = function () {
        return ['Enabled', 'Username', 'Nume', 'Telefon', 'Adresa', 'Ultima actualizare', 'Profesie', 'Specialitate', 'Divizie', 'Job', 'Oras'];
    };

    ManageAccountsService.users.query().$promise.then(function (resp) {
        var data = Success.getObject(resp);
        $scope.csv.rows = exportCSV.formatArrayCSV(data,
            ['enabled', 'username', 'name', 'phone', 'address', 'phone', 'last_updated'],
            [{'jobsID': 'job_name'}, {'citiesID': 'name'}],
            [{'profession' : 'display_name'}, {'specialty' : 'name'}, {'division': 'name'}]);

        $scope.csv.rows.forEach(function (item) {
            if(item.jobsID == "null") {
                item.jobsID = "";
            }
            if(item.last_updated) {
                item.last_updated = new Date(item.last_updated);
                if(item.last_updated.getTime() === item.last_updated.getTime()) {
                    item.last_updated = item.last_updated.getDate() + '/' + (item.last_updated.getMonth() + 1) + '/' + item.last_updated.getFullYear();
                } else {
                    item.last_updated = "";
                }
            }
            item.enabled = item.enabled === true ? 'ACTIV' : 'INACTIV';
        });

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                username: 'asc'     // initial sorting
            }
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                for (var property in params.filter()) {
                    if (params.filter()[property] === '') {
                        delete params.filter()[property];
                    }
                }
                var filteredData = params.filter() ? $filter('filter')(data, params.filter()) : data;
                var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : data;
                $scope.resultData = orderedData;
                params.total(orderedData.length);
                if(params.total() < (params.page() -1) * params.count()){
                    params.page(1);
                }
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });

    $scope.routingRoleDisplayName = function (name) {
        switch(name){
            case "admin": return "Administrator"; break;
            case "manager": return "Manager"; break;
            case "reprezentant": return "Reprezentant"; break;
            default: return null; break;
        }
    };

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