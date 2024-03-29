controllers.controller('Intro', ['$scope','$rootScope' ,'IntroService','$stateParams','$sce','$filter','$state','ngTableParams','$modal', 'Success', 'Error', function($scope,$rootScope,IntroService,$stateParams,$sce,$filter,$state,ngTableParams,$modal,Success,Error){
    function refreshTable() {
        IntroService.intros.query().$promise.then(function (data) {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    last_updated: 'desc'     // initial sorting
                },
                filter: {
                    description: ''       // initial filter
                }
            }, {
                total: Success.getObject(data).length, // length of data
                getData: function ($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(Success.getObject(data), params.filter())), params.orderBy());
                    $scope.resultData = orderedData;
                    params.total(orderedData.length);
                    if (params.total() < (params.page() - 1) * params.count()) {
                        params.page(1);
                    }
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        }).catch(function (err) {
            console.log(Error.getMessage(err));
        });
    }
    refreshTable();


    $scope.viewIntro= function(id){
        $modal.open({
            templateUrl: 'partials/admin/content/IntroDetails.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'IntroDetails',
            resolve: {
                idToView: function () {
                    return id;
                }
            }
        });
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
    $scope.addIntro= function(){
        IntroService.intros.create({}).$promise.then(function(resp){
            refreshTable();
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };
    $scope.deleteIntro= function(id){
        console.log(id);
        $modal.open({
            templateUrl: 'partials/admin/content/deleteIntro.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'IntroDelete',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        });
    };
    $scope.toggleIntro= function(id,status){
        $modal.open({
            templateUrl: 'partials/admin/content/toggleIntro.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'IntroToggle',
            resolve: {
                idToEdit: function () {
                    return id;
                },
                status: function(){
                    return status;
                }
            }
        });
    }
}]);