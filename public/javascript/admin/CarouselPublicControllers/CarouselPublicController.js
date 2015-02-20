controllers.controller('CarouselPublicController', ['$scope', '$state', '$rootScope','$filter', 'ngTableParams', '$modal', 'ActionModal', 'CarouselPublicService' ,function($scope, $state, $rootScope, $filter, ngTableParams, $modal, ActionModal, CarouselPublicService){

    $scope.refreshTable = function () {
        CarouselPublicService.getAllImages.query().$promise.then(function (resp) {
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
            templateUrl: 'partials/admin/continut/carouselPublic/modalAddPublicCarousel.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'AddPublicCarouselController'
        });
    };

    $scope.deleteImage = function (id) {
        ActionModal.show("Sterge imagine", "Sunteti sigur ca doriti sa stergeti imaginea?", function () {
            CarouselPublicService.deleteImage.save({id: id}).$promise.then(function (resp) {
                console.log(resp);
                $state.reload();
            });
        }, "Sterge");
    };

    $scope.toggleImageEnable = function (id, enabled) {
        $modal.open({
            templateUrl: 'partials/admin/continut/carouselPublic/modalToggleEnablePublicCarousel.html',
            size: 'sm',
            windowClass: 'fade',
            controller: 'ToggleEnablePublicCarouselController',
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
            templateUrl: 'partials/admin/continut/carouselPublic/modalEditPublicCarousel.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'EditPublicCarouselController',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        });
    };
}]);