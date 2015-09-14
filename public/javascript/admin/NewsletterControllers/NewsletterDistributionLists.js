controllers.controller('NewsletterDistributionLists', ['$scope', '$state', 'NewsletterService', 'ngTableParams', '$filter', '$modal', 'InfoModal', 'ActionModal', 'Success', '$q', function ($scope, $state, NewsletterService, ngTableParams, $filter, $modal, InfoModal, ActionModal, Success, $q) {
    var refreshLists = function () {
        NewsletterService.distributionLists.query().$promise.then(function(resp){
            var lists = Success.getObject(resp);
            var params = {
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    date_created: 'desc'     // initial sorting
                }
            };
            $scope.tableParams = new ngTableParams(params, {
                total: lists.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(lists, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };
    refreshLists();

    $scope.addList = function () {
        NewsletterService.distributionLists.create({}).$promise.then(function () {
            refreshLists();
        });
    };

    $scope.editList = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/newsletter/distributionLists/modalEditDistributionList.html',
            windowClass: 'fade',
            controller: 'NewsletterDistributionListEdit',
            size: 'lg',
            resolve: {
                idToEdit: function () {
                    return id;
                },
                refreshLists: function () {
                    return refreshLists;
                }
            }
        });
    };

    $scope.removeList = function (id) {
        ActionModal.show("Stergere lista", "Sunteti sigur ca doriti sa stergeti lista de distributie?", function () {
            NewsletterService.distributionLists.delete({id: id}).$promise.then(function () {
                $state.reload();
            });
        },{
            yes: "Sterge"
        });
    };

}]);