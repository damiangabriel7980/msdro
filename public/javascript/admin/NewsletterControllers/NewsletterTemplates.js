controllers.controller('NewsletterTemplates', ['$scope', '$state', 'NewsletterService', 'ngTableParams', '$filter', '$modal', 'InfoModal', 'ActionModal', 'Success', '$q', function ($scope, $state, NewsletterService, ngTableParams, $filter, $modal, InfoModal, ActionModal, Success, $q) {
    var refreshTemplates = function () {
        NewsletterService.templates.query().$promise.then(function(resp){
            var templates = Success.getObject(resp);
            var params = {
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    date_created: 'desc'     // initial sorting
                }
            };
            $scope.tableParams = new ngTableParams(params, {
                total: templates.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(templates, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };
    refreshTemplates();

    $scope.addTemplate = function () {
        NewsletterService.templates.create({}).$promise.then(function () {
            refreshTemplates();
        });
    };

    $scope.editTemplate = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/newsletter/campaigns/modalEditTemplate.html',
            windowClass: 'fade',
            controller: 'NewsletterTemplateEdit',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        });
    };

    $scope.removeTemplate = function (id) {
        ActionModal.show("Stergere template", "Sunteti sigur ca doriti sa stergeti template-ul?", function () {
            NewsletterService.templates.delete({id: id}).$promise.then(function () {
                $state.reload();
            });
        }, "Sterge");
    };

}]);