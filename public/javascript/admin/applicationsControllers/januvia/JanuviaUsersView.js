controllers.controller('JanuviaUsersView', ['$scope', '$state', 'JanuviaService', 'ngTableParams', '$filter', '$modal', 'InfoModal', 'ActionModal', 'Success', '$q', function ($scope, $state, JanuviaService, ngTableParams, $filter, $modal, InfoModal, ActionModal, Success, $q) {
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
                    var filters = {};

                    angular.forEach(params.filter(), function(value, key) {
                        if (key.indexOf('.') === -1) {
                            filters[key] = value;
                            return;
                        }

                        var createObjectTree = function (tree, properties, value) {
                            if (!properties.length) {
                                return value;
                            }

                            var prop = properties.shift();

                            if (!prop || !/^[a-zA-Z]/.test(prop)) {
                                throw new Error('invalid nested property name for filter');
                            }

                            tree[prop] = createObjectTree({}, properties, value);

                            return tree;
                        };

                        var filter = createObjectTree({}, key.split('.'), value);

                        angular.extend(filters, filter);
                    });

                    var orderedData = params.filter() ? $filter('orderBy')(($filter('filter')(users, filters)), params.orderBy()) : users;
                    $scope.resultData = orderedData;

                    params.total(orderedData.length);
                    if(params.total() < (params.page() -1) * params.count()){
                        params.page(1);
                    }
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };
    refreshUsers();

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