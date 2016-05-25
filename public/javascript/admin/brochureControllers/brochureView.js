/**
 * Created by andreimirica on 16.05.2016.
 */
/**
 * Created by miricaandrei23 on 26.11.2014.
 */
controllers.controller('brochureController', ['$scope','$rootScope', '$state', 'brochureService','$stateParams','$sce','ngTableParams','$filter', '$modal', 'ActionModal', 'Success', 'Error', function($scope,$rootScope, $state, brochureService,$stateParams,$sce,ngTableParams,$filter, $modal, ActionModal, Success, Error){

    function refreshTable(){
        brochureService.brochureSections.query().$promise.then(function(result){
            var brochures = Success.getObject(result);
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    last_updated: 'desc'     // initial sorting
                },
                filter: {
                    title: ''       // initial filter
                }
            }, {
                total: brochures.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(brochures, params.filter())), params.orderBy());
                    params.total(orderedData.length);
                    $scope.resultData = orderedData;
                    if(params.total() < (params.page() -1) * params.count()){
                        params.page(1);
                    }
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };

    refreshTable();

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.selectedItems = new Set();

    $scope.addToSelectedItems = function(id){
        if($scope.selectedItems.has(id)){
            $scope.selectedItems.delete(id)
        } else {
            $scope.selectedItems.add(id);
        }
    };
    $scope.checkValue = function(id){
        if($scope.selectedItems.has(id)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.addBrochureSection = function () {
        brochureService.brochureSections.create({}).$promise.then(function(){
            $state.reload();
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.editbrochureSection = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/brochure/editBrochureSection.html',
            backdrop: 'static',
            size: 'lg',
            keyboard: false,
            windowClass: 'fade',
            controller: "brochureEdit",
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        })
    };

    $scope.toggleBrochureSection = function(id, isEnabled){
        ActionModal.show(
            isEnabled?"Dezactiveaza sectiune brosura":"Activeaza sectiune brosura",
            isEnabled?"Sunteti sigur ca doriti sa dezactivati aceasta sectiune a brosurii?":"Sunteti sigur ca doriti sa activati aceasta sectiune a brosurii?",
            function () {
                brochureService.brochureSections.update({id: id}, {enabled: !isEnabled}).$promise.then(function (resp) {
                    console.log(resp);
                    $state.reload();
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            },{
                yes: "Da"
            }
        );
    };


    $scope.deleteBrochureSection = function (id) {
        ActionModal.show("Stergere sectiune brosura", "Sunteti sigur ca doriti sa stergeti aceasta sectiune a brosurii?", function () {
            brochureService.brochureSections.delete({id: id}).$promise.then(function(result){
                console.log(result);
                $state.reload();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Sterge"
        });
    }

}]);
