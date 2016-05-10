/**
 * Created by miricaandrei23 on 26.11.2014.
 */
controllers.controller('Pathologies', ['$scope','$rootScope', '$state', 'PathologiesService','$stateParams','$sce','ngTableParams','$filter', '$modal', 'ActionModal', 'Success', 'Error', function($scope,$rootScope, $state, PathologiesService,$stateParams,$sce,ngTableParams,$filter, $modal, ActionModal, Success, Error){

    function refreshTable(){
        PathologiesService.pathologies.query().$promise.then(function(result){
            var pathologies = Success.getObject(result);
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    last_updated: 'desc'     // initial sorting
                },
                filter: {
                    display_name: ''       // initial filter
                }
            }, {
                total: pathologies.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(pathologies, params.filter())), params.orderBy());
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

    $scope.entities = {
       'multimedia': 'pathologiesID',
        'articles': 'pathologiesID',
        'calendar-events': 'pathologiesID',
        'specialProducts': 'pathologiesID'
    };

    $scope.addPathology = function () {
        PathologiesService.pathologies.create({}).$promise.then(function(){
            $state.reload();
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.editPathology = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/pathologies/editPathology.html',
            backdrop: 'static',
            size: 'lg',
            keyboard: false,
            windowClass: 'fade',
            controller: "EditPathology",
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        })
    };

    $scope.togglePathology = function(id, isEnabled){
        ActionModal.show(
            isEnabled?"Dezactiveaza patologie":"Activeaza patologie",
            isEnabled?"Sunteti sigur ca doriti sa dezactivati patologia?":"Sunteti sigur ca doriti sa activati patologia?",
            function () {
                PathologiesService.pathologies.update({id: id}, {enabled: !isEnabled}).$promise.then(function (resp) {
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


    $scope.deletePathology = function (id) {
        ActionModal.show("Stergere patologie", "Sunteti sigur ca doriti sa stergeti aceasta patologie?", function () {
            PathologiesService.pathologies.delete({id: id}).$promise.then(function(result){
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
