cloudAdminControllers.controller('CarouselMedicController', ['$scope', '$rootScope','$filter', 'ngTableParams', '$modal', 'CarouselMedicService' ,function($scope, $rootScope, $filter, ngTableParams, $modal, CarouselMedicService){

    $scope.refreshTable = function () {
        CarouselMedicService.getAllImages.query().$promise.then(function (resp) {
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


    $scope.addImage = function(){
        $modal.open({
            templateUrl: 'partials/admin/continut/carouselMedic/modalAddMedicCarousel.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'AddMedicCarouselController'
        });
    };

    $scope.deleteImage = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/continut/carouselMedic/modalDeleteMedicCarousel.html',
            size: 'sm',
            windowClass: 'fade',
            controller: 'DeleteMedicCarouselController',
            resolve: {
                idToDelete: function () {
                    return id;
                }
            }
        });
    };

    $scope.toggleImageEnable = function (id, enabled) {
        $modal.open({
            templateUrl: 'partials/admin/continut/carouselMedic/modalToggleEnableMedicCarousel.html',
            size: 'sm',
            windowClass: 'fade',
            controller: 'ToggleEnableMedicCarouselController',
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

    $scope.editImage = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/continut/carouselMedic/modalEditMedicCarousel.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'EditMedicCarouselController',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        });
    };
}]);