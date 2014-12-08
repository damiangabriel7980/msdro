cloudAdminControllers.controller('ContinutPublicController', ['$scope', '$rootScope','$filter', 'ngTableParams', '$modal', 'ContinutPublicService' ,function($scope, $rootScope, $filter, ngTableParams, $modal, ContinutPublicService){

    $scope.refreshTable = function () {
        ContinutPublicService.getAllContent.query().$promise.then(function (resp) {
            var data = resp;

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    title: 'asc'     // initial sorting
                },
                filter: {
                    title: ''       // initial filter
                }
            }, {
                total: data.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(data, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };

    $scope.refreshTable();

    $scope.typeDisplay = function (type) {
        switch(type){
            case 1: return "Stire"; break;
            case 2: return "Articol"; break;
            case 3: return "Elearning"; break;
            case 4: return "Download"; break;
            default: return "Necunoscut"; break;
        }
    };

    $scope.addContent = function(){
        $modal.open({
            templateUrl: 'partials/admin/continut/continutPublic/modalAddPublicContent.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'AddPublicContentController'
        });
    };

    $scope.deleteContent = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/continut/continutPublic/modalDeletePublicContent.html',
            size: 'sm',
            windowClass: 'fade',
            controller: 'DeletePublicContentController',
            resolve: {
                idToDelete: function () {
                    return id;
                }
            }
        });
    };

    $scope.toogleContentEnable = function (id, enabled) {
        $modal.open({
            templateUrl: 'partials/admin/continut/continutPublic/modalToogleEnablePublicContent.html',
            size: 'sm',
            windowClass: 'fade',
            controller: 'ToggleEnablePublicContentController',
            resolve: {
                idToToggle: function () {
                    return id;
                },
                isEnabled: function () {
                    return enabled;
                }
            }
        });
    };

    $scope.editContent = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/continut/continutPublic/modalEditPublicContent.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'EditPublicContentController',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        });
    };
}]);