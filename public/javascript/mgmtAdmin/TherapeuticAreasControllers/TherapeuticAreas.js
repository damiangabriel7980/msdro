/**
 * Created by miricaandrei23 on 26.11.2014.
 */
controllers.controller('TherapeuticAreas', ['$scope','$rootScope', '$state', 'therapeuticAreas', 'areasAdminService','$stateParams','$sce','ngTableParams','$filter', '$modal', 'ActionModal', 'Success', 'Error', function($scope,$rootScope, $state, therapeuticAreas, areasAdminService,$stateParams,$sce,ngTableParams,$filter, $modal, ActionModal, Success, Error){

    function refreshTable(){
        areasAdminService.areas.query().$promise.then(function(result){
            var areas = therapeuticAreas.organiseByParent(Success.getObject(result));
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    last_updated: 'desc'     // initial sorting
                },
                filter: {
                    name: ''       // initial filter
                }
            }, {
                total: areas.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(areas, params.filter())), params.orderBy());
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

    $scope.addArea = function () {
        areasAdminService.areas.create({}).$promise.then(function(){
            refreshTable();
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.editArea = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/ariiTerapeutice/ariiTerapeuticeEdit.html',
            backdrop: 'static',
            keyboard: false,
            windowClass: 'fade',
            controller: "EditTherapeuticAreas",
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        })
    };

    $scope.deleteArea = function (id) {
        ActionModal.show("Stergere arie terapeutica", "Sunteti sigur ca doriti sa stergeti aria terapeutica?", function () {
            areasAdminService.areas.delete({id: id}).$promise.then(function(result){
                console.log(result);
                $state.reload();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Sterge"
        });
    }

}])
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        }
    })
    .filter("asDate", function () {
        return function (input) {
            return new Date(input);
        }
    });
