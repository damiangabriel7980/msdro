controllers.controller('NewsletterUnsubscribedEmails', ['$scope', '$state', 'NewsletterService', 'ngTableParams', '$filter', '$modal', 'InfoModal', 'ActionModal', 'Success', function ($scope, $state, NewsletterService, ngTableParams, $filter, $modal, InfoModal, ActionModal, Success) {
    NewsletterService.unsubscribedEmails.query().$promise.then(function(resp){
        var people = Success.getObject(resp);
        var params = {
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                email: 'asc'     // initial sorting
            }
        };
        $scope.tableParams = new ngTableParams(params, {
            total: people.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(people, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });
}]);