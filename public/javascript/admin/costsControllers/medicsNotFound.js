controllers.controller('MedicsNotFound', ['$scope', '$state', 'UserCostsService', 'ManageAccountsService', 'Success', '$modalInstance', 'ngTableParams', '$filter', function ($scope, $state, UserCostsService, ManageAccountsService, Success, $modalInstance, ngTableParams, $filter) {

    UserCostsService.users.query().$promise.then(function(resp){
        var importedUsers = Success.getObject(resp);
        ManageAccountsService.users.query().$promise.then(function (resp) {
            var users = Success.getObject(resp);
            var usersNotFound = [];
            var foundUser = false;
            angular.forEach(importedUsers, function (importedUser) {
                if(importedUser.userName) {
                    angular.forEach(users, function (user) {
                        if(importedUser.userName == user.username) {
                            foundUser = true;
                        }
                    });
                    if(!foundUser) {
                        var duplicateUser = false;
                        angular.forEach(usersNotFound, function (value) {
                            if(importedUser.userName == value.userName) {
                                duplicateUser = true;
                            }
                        });
                        if(!duplicateUser) {
                            usersNotFound.push(importedUser);
                            foundUser = false;
                            duplicateUser = true;
                        }
                    }
                }
            });

            var params = {
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    date_created: 'desc'     // initial sorting
                }
            };

            $scope.tableParams = new ngTableParams(params, {
                total: usersNotFound.length, // length of data
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

                    var orderedData = params.filter() ? $filter('orderBy')(($filter('filter')(usersNotFound, filters)), params.orderBy()) : usersNotFound;
                    $scope.resultData = orderedData;

                    params.total(orderedData.length);
                    if(params.total() < (params.page() -1) * params.count()){
                        params.page(1);
                    }
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });

    });





    $scope.closeModal = function () {
        $modalInstance.close();
    };

}]);