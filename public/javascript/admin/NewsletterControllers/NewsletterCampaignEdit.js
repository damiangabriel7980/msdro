controllers.controller('NewsletterCampaignEdit',['$scope', 'NewsletterService', 'idToEdit', 'Success', '$modalInstance', 'refreshCampaigns', '$modal', 'Utils', 'ActionModal', 'InfoModal', function ($scope, NewsletterService, idToEdit, Success, $modalInstance, refreshCampaigns, $modal, Utils, ActionModal, InfoModal) {

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
        if(!Utils.objectHasAllProperties(toSave, ["name", "subject"])){
            ActionModal.show("Atentie", "Campania contine campuri necompletate", function () {
                saveCampaign(toSave);
            }, {
                yes: "Salveaza oricum",
                no: "Continua editarea"
            });
        }else if(!toSave.distribution_lists || toSave.distribution_lists.length === 0){
            InfoModal.show("Atentie", "Trebuie sa bifati cel putin o lista de distributie");
        }else if(!toSave.templates || toSave.templates.length === 0){
            InfoModal.show("Atentie", "Trebuie sa introduceti cel putin un template");
        }else if(templatesContainEmptyVariables(toSave.templates)){
            ActionModal.show("Atentie", "Unele template-uri contin variabile necompletate", function () {
                saveCampaign(toSave);
            }, {
                yes: "Salveaza oricum",
                no: "Continua editarea"
            });
        }else if(toSave.send_date){
            try{
                if(new Date(toSave.send_date) < new Date()){
                    InfoModal.show("Atentie", "Data trimiterii nu poate fi mai devreme decat data curenta");
                }else{
                    saveCampaign(toSave);
                }
            }catch(ex){
                console.log(ex);
            }
        }else{
            saveCampaign(toSave);
        }
    };

    function saveCampaign(toSave){
        NewsletterService.campaigns.update({id: idToEdit}, toSave).$promise.then(function () {
            refreshCampaigns();
            $modalInstance.close();
        });
    }

    function templatesContainEmptyVariables(templates) {
        console.log(templates);
        for(var i=0; i<templates.length; i++){
            if(templates[i].variables){
                for(var j=0; j<templates[i].variables.length; j++){
                    if(!templates[i].variables[j] || !templates[i].variables[j].value) return true;
                }
            }
        }
        return false;
    }

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

    function resetAlert(text, type){
        $scope.editCampaignAlert = {
            text: text,
            type: type || "danger"
        }
    }

    $scope.renderTemplate = NewsletterService.templates.renderTemplate;

}]);