controllers.controller('CarouselMedic', ['$scope', '$state', '$rootScope','$filter', 'ngTableParams', '$modal', 'ActionModal', 'CarouselMedicService' , 'Success', 'Error', function($scope, $state, $rootScope, $filter, ngTableParams, $modal, ActionModal, CarouselMedicService,Success,Error){

    $scope.refreshTable = function () {
        CarouselMedicService.carouselMedic.query().$promise.then(function (resp) {
            var data = Success.getObject(resp);
            console.log(data);

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

    $scope.checkArticleDisabled = function (image) {
        return image.article_id && !image.article_id.enable;
    };

    $scope.addImage = function(){
        CarouselMedicService.carouselMedic.create({}).$promise.then(function (resp) {
            $scope.refreshTable();
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.deleteImage = function (id) {
        ActionModal.show("Stergere imagine", "Sunteti sigur ca doriti sa stergeti imaginea?", function () {
            CarouselMedicService.carouselMedic.delete({id: id}).$promise.then(function (resp) {
                console.log(resp);
                $state.reload();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Sterge"
        });
    };

    $scope.toggleImageEnable = function (id, enabled) {
        ActionModal.show(
            enabled?"Dezactiveaza imagine":"Activeaza imagine",
            enabled?"Sunteti sigur ca doriti sa dezactivati imaginea?":"Sunteti sigur ca doriti sa activati imaginea?",
            function () {
                CarouselMedicService.carouselMedic.update({id: id},{info: {isEnabled: enabled}}).$promise.then(function (resp) {
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

    $scope.editImage = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/content/carouselMedic/modalEditMedicCarousel.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'EditCarouselMedic',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        });
    };
}]);