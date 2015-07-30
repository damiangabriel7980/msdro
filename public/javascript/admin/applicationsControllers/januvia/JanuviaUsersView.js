controllers.controller('JanuviaUsersView', ['$scope', '$state', 'JanuviaService', 'ngTableParams', '$filter', '$modal', 'InfoModal', 'ActionModal', 'Success', function ($scope, $state, JanuviaService, ngTableParams, $filter, $modal, InfoModal, ActionModal, Success) {
    var refreshUsers = function () {
        JanuviaService.users.query().$promise.then(function(resp){
            var users = Success.getObject(resp);
            var params = {
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    date_created: 'desc'     // initial sorting
                }
            };
            $scope.tableParams = new ngTableParams(params, {
                total: users.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(users, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };
    refreshUsers();

    $scope.addUser = function () {
        JanuviaService.users.create({}).$promise.then(function () {
            refreshUsers();
        });
    };

    $scope.editUser = function () {
        $modal.open({
            templateUrl: 'partials/admin/applications/januvia/modalEditUser.html',
            windowClass: 'fade',
            controller: 'JanuviaUserEdit'
        });
    };

    $scope.removeUser = function (id) {
        ActionModal.show("Stergere utilizator", "Sunteti sigur ca doriti sa stergeti utilizatorul?", function () {
            JanuviaService.users.delete({id: id}).$promise.then(function () {
                $state.reload();
            });
        }, "Sterge");
    };

}]);