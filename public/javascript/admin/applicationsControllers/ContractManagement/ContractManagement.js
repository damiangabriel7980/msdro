controllers.controller('ContractManagement', ['$scope', '$state', 'ContractManagementService', 'ngTableParams', '$filter', '$modal', 'InfoModal', 'ActionModal', 'AmazonService', 'Success', function ($scope, $state, ContractManagementService, ngTableParams, $filter, $modal, InfoModal, ActionModal, AmazonService, Success) {
    var refreshTemplates = function (sortByDate) {
        ContractManagementService.templates.query().$promise.then(function(resp){
            var events = Success.getObject(resp);
            var params = {
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    name: 'asc'     // initial sorting
                },
                filter: {
                    name: ''       // initial filter
                }
            };
            if(sortByDate){
                params.sorting = {last_updated: 'desc'};
            }
            $scope.tableParams = new ngTableParams(params, {
                total: events.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(events, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };
    refreshTemplates();

    $scope.addTemplate = function () {
        ContractManagementService.templates.create({}).$promise.then(function () {
            console.log($scope.tableParams.total());
            if($scope.tableParams.total() == 0){
                $state.reload();
            }else{
                refreshTemplates(true);
            }
        }).catch(function () {
            InfoModal.show("Eroare la adaugare", "A aparut o eroare la adaugarea template-ului");
        });
    };

    $scope.toggleTemplate = function (template) {
        ActionModal.show(
            template.isEnabled?"Dezactiveaza template":"Activeaza template",
            template.isEnabled?"Sunteti sigur ca doriti sa dezactivati template-ul?":"Sunteti sigur ca doriti sa activati template-ul?",
            function () {
                ContractManagementService.templates.update({id: template._id}, {isEnabled: !template.isEnabled}).$promise.then(function () {
                    refreshTemplates();
                });
            }
        );
    };

    $scope.editTemplate = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/applications/contractManagement/editTemplate.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'EditTemplate',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        });
    };

    $scope.removeTemplate = function (id) {
        ActionModal.show("Stergere template", "Sunteti sigur ca doriti sa stergeti template-ul?", function () {
            async.parallel([
                function (callback) {
                    //remove files
                    AmazonService.deleteFilesAtPath("contractManagement/templates/"+id, function (err, count) {
                        if(err){
                            console.log(err);
                            callback("Eroare la stergerea fisierelor")
                        }else{
                            callback();
                        }
                    });
                },
                function (callback) {
                    //remove from db
                    ContractManagementService.templates.delete({id: id}).$promise.then(function () {
                        callback();
                    }).catch(function () {
                        callback("Eroare la stergerea din baza de date");
                    });
                }
            ], function (err) {
                if(err){
                    ActionModal.show("Eroare", err, function () {
                        refreshTemplates();
                    });
                }else{
                    ActionModal.show("Stergere reusita", "Template-ul a fost sters cu succes.", function () {
                        refreshTemplates();
                    },{
                        yes:"Continua"
                    });
                }
            });
        },{
            yes: "Da"
        });
    };
}]);