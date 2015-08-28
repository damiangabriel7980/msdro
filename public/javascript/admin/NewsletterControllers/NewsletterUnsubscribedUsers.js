controllers.controller('NewsletterUnsubscribedUsers', ['$scope', '$state', 'NewsletterService', 'ngTableParams', '$filter', '$modal', 'InfoModal', 'ActionModal', 'Success', function ($scope, $state, NewsletterService, ngTableParams, $filter, $modal, InfoModal, ActionModal, Success) {
    NewsletterService.users.query({unsubscribed: true}).$promise.then(function(resp){
        var users = Success.getObject(resp);
        var params = {
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                username: 'asc'     // initial sorting
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
}]);