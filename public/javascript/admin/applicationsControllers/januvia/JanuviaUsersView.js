controllers.controller('JanuviaUsersView', ['$scope', '$state', 'JanuviaService', 'ngTableParams', '$filter', '$modal', 'InfoModal', 'ActionModal', 'Success', '$q', function ($scope, $state, JanuviaService, ngTableParams, $filter, $modal, InfoModal, ActionModal, Success, $q) {
    var refreshUsers = function () {
        JanuviaService.users.query().$promise.then(function(resp){
            var users = Success.getObject(resp);
            console.log(users);
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

    $scope.fileSelected = function($files, $event){
        //make sure group data is loaded. we need to access it to form the amazon key
        //make sure a file was actually loaded
        if($files[0]){
            var file = $files[0];
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                    var data = evt.target.result;
                    JanuviaService.parseExcel.create({file: data}).$promise.then(function(resp){
                        $state.reload();
                    })
                }
            };
            reader.readAsBinaryString(file);

        }

    };

    $scope.editUser = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/applications/januvia/modalEditUser.html',
            windowClass: 'fade',
            controller: 'JanuviaUserEdit',
            resolve: {
                idToEdit: function () {
                    return id;
                },
                userTypes: function () {
                    var deferred = $q.defer();
                    JanuviaService.user_types.query().$promise.then(function (resp) {
                        deferred.resolve(Success.getObject(resp));
                    });
                    return deferred.promise;
                }
            }
        });
    };

    $scope.removeUser = function (id) {
        ActionModal.show("Stergere utilizator", "Sunteti sigur ca doriti sa stergeti utilizatorul?", function () {
            JanuviaService.users.delete({id: id}).$promise.then(function () {
                $state.reload();
            });
        },{
            yes: "Sterge"
        });
    };

}]);