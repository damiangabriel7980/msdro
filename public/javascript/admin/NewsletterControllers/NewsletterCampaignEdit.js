controllers.controller('NewsletterCampaignEdit',['$scope', 'NewsletterService', 'idToEdit', 'Success', '$modalInstance', 'refreshCampaigns', '$modal', function ($scope, NewsletterService, idToEdit, Success, $modalInstance, refreshCampaigns, $modal) {

    NewsletterService.campaigns.query({id: idToEdit}).$promise.then(function (resp) {
        var campaign = Success.getObject(resp);
        $scope.campaign = campaign;
        $scope.campaign.templates = $scope.campaign.templates || [];
        $scope.selectedDistributionLists = campaign.distribution_lists || [];
    });

    NewsletterService.templates.api.query().$promise.then(function (resp) {
        var templates = Success.getObject(resp);
        var templatesById = {};
        for(var i=0; i<templates.length; i++){
            templatesById[templates[i]._id] = templates[i];
        }
        $scope.templatesById = templatesById;
    });

    NewsletterService.distributionLists.query().$promise.then(function (resp) {
        $scope.distributionLists = Success.getObject(resp);
    });

    $scope.save = function () {
        var toSave = $scope.campaign;
        toSave.distribution_lists = $scope.selectedDistributionListsIds;
        NewsletterService.campaigns.update({id: idToEdit}, toSave).$promise.then(function () {
            refreshCampaigns();
            $modalInstance.close();
        });
    };

    $scope.addTemplate = function () {
        $modal.open({
            templateUrl: 'partials/admin/newsletter/campaigns/chooseTemplate.html',
            windowClass: 'fade',
            controller: 'NewsletterCampaignChooseTemplate',
            size: 'lg',
            resolve: {
                templates: function () {
                    return $scope.campaign.templates;
                }
            }
        });
    };

    $scope.populateTemplate = function (template) {
        $modal.open({
            templateUrl: 'partials/admin/newsletter/campaigns/populateTemplate.html',
            windowClass: 'fade',
            controller: 'NewsletterCampaignPopulateTemplate',
            size: 'lg',
            resolve: {
                template: function () {
                    return template;
                },
                templatesById: function () {
                    return $scope.templatesById;
                }
            }
        });
    };

    $scope.shiftTemplateDown = function (order_index) {
        var replaceThis = findTemplateByOrderIndex(order_index);
        var replaceWith = findTemplateByOrderIndex(order_index+1);
        if(replaceThis !== null && replaceWith !== null){
            replaceThis.order = order_index + 1;
            replaceWith.order = order_index;
        }
    };

    $scope.shiftTemplateUp = function (order_index) {
        var replaceThis = findTemplateByOrderIndex(order_index);
        var replaceWith = findTemplateByOrderIndex(order_index-1);
        if(replaceThis !== null && replaceWith !== null){
            replaceThis.order = order_index - 1;
            replaceWith.order = order_index;
        }
    };

    $scope.removeTemplate = function (index) {
        //console.log(index);
        //console.log($scope.campaign.templates);
        //console.log(findTemplateByOrderIndex(index, true));
        var splicedElementOrder = findTemplateByOrderIndex(index).order;
        var spliceAt = findTemplateByOrderIndex(index, true);
        $scope.campaign.templates.splice(spliceAt, 1);
        var templates = $scope.campaign.templates;
        for(var i=0; i<templates.length; i++){
            if(templates[i].order > splicedElementOrder) templates[i].order -= 1;
        }
        //console.log($scope.campaign.templates);
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    };

    function findTemplateByOrderIndex(idx, returnIndex){
        var templates = $scope.campaign.templates;
        for(var i=0; i<templates.length; i++){
            if(templates[i].order === idx){
                return returnIndex?i:templates[i];
            }
        }
        return null;
    }

}]);