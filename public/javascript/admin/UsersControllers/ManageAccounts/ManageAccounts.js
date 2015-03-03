controllers.controller('ManageAccounts', ['$scope','ManageAccountsService', '$modal', '$state','$filter', 'ngTableParams', 'ActionModal', function($scope, ManageAccountsService, $modal, $state,$filter,ngTableParams, ActionModal){

    ManageAccountsService.users.query().$promise.then(function (resp) {
        var data = resp.success;
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
            total: data.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(data, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });
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
        console.log(id);
        $modal.open({
            templateUrl: 'partials/admin/users/toggleAccount.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'ToggleAccount',
            resolve: {
                idToEdit: function () {
                    return id;
                },
                enabledUser: function () {
                    return enabledUser;
                }
            }
        });
    }
}]);