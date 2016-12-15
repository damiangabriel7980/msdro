/**
 * Created by paulsuceveanu on 17.05.2016.
 */
controllers.controller('MedicCosts', ['$scope', '$rootScope', '$stateParams', '$state', '$timeout', 'Success', 'Error', 'ngTableParams', '$filter', 'medicCostsService', function($scope, $rootScope, $stateParams, $state, $timeout, Success, Error, ngTableParams, $filter, medicCostsService){

    var refreshUsers = function () {
        medicCostsService.users.query().$promise.then(function(resp){
            debugger;
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
}]);