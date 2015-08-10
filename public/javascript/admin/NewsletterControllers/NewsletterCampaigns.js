controllers.controller('NewsletterCampaigns', ['$scope', '$state', 'NewsletterService', 'ngTableParams', '$filter', '$modal', 'InfoModal', 'ActionModal', 'Success', '$q', function ($scope, $state, NewsletterService, ngTableParams, $filter, $modal, InfoModal, ActionModal, Success, $q) {
    var refreshCampaigns = function () {
        NewsletterService.campaigns.query().$promise.then(function(resp){
            var campaigns = Success.getObject(resp);
            var params = {
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    date_created: 'desc'     // initial sorting
                }
            };
            $scope.tableParams = new ngTableParams(params, {
                total: campaigns.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(campaigns, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };
    refreshCampaigns();

    $scope.addCampaign = function () {
        NewsletterService.campaigns.create({}).$promise.then(function () {
            refreshCampaigns();
        });
    };

    $scope.editCampaign = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/newsletter/campaigns/modalEditCampaign.html',
            windowClass: 'fade',
            controller: 'NewsletterCampaignEdit',
            resolve: {
                idToEdit: function () {
                    return id;
                },
                refreshCampaigns: function () {
                    return refreshCampaigns;
                }
            }
        });
    };

    $scope.removeCampaign = function (id) {
        ActionModal.show("Stergere campanie", "Sunteti sigur ca doriti sa stergeti campania?", function () {
            NewsletterService.campaigns.delete({id: id}).$promise.then(function () {
                $state.reload();
            });
        }, "Sterge");
    };

}]);