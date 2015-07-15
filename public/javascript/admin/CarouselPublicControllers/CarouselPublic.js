controllers.controller('CarouselPublic', ['$scope', '$state', '$rootScope','$filter', 'ngTableParams', '$modal', 'ActionModal', 'CarouselPublicService' , 'Success', 'Error', function($scope, $state, $rootScope, $filter, ngTableParams, $modal, ActionModal, CarouselPublicService,Success,Error){

    $scope.refreshTable = function () {
        CarouselPublicService.carouselPublic.query().$promise.then(function (resp) {
            var data = Success.getObject(resp);

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
                    params.total(orderedData.length);
                    if(params.total() < (params.page() -1) * params.count()){
                        params.page(1);
                    }
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        }).catch(function(err){
            console.log(Error.getMessage(err));
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
            templateUrl: 'partials/admin/content/carouselPublic/modalAddPublicCarousel.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'AddCarouselPublic'
        });
    };

    $scope.deleteImage = function (id) {
        ActionModal.show("Sterge imagine", "Sunteti sigur ca doriti sa stergeti imaginea?", function () {
            CarouselPublicService.carouselPublic.delete({id: id}).$promise.then(function (resp) {
                $state.reload();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        }, "Sterge");
    };

    $scope.toggleImageEnable = function (id, enabled) {
        ActionModal.show(
            enabled?"Dezactiveaza imagine":"Activeaza imagine",
            enabled?"Sunteti sigur ca doriti sa dezactivati imaginea?":"Sunteti sigur ca doriti sa activati imaginea?",
            function () {
                CarouselPublicService.carouselPublic.update({id: id},{info: {isEnabled: enabled}}).$promise.then(function (resp) {
                    $state.reload();
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            },
            "Da"
        );
    };

    $scope.editImage = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/content/carouselPublic/modalEditPublicCarousel.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'EditCarouselPublic',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        });
    };
}]);