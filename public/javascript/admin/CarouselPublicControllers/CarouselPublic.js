controllers.controller('CarouselPublic', ['$scope', '$state', '$rootScope','$filter', 'ngTableParams', '$modal', 'ActionModal', 'CarouselPublicService' , 'Success', 'Error', function($scope, $state, $rootScope, $filter, ngTableParams, $modal, ActionModal, CarouselPublicService,Success,Error){

    $scope.refreshTable = function () {
        CarouselPublicService.carouselPublic.query().$promise.then(function (resp) {
            var data = Success.getObject(resp);

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    order_index: 'asc'     // initial sorting
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
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.refreshTable();

    $scope.linkTypeDisplay = function (image) {
        switch(image.link_name){
            case "content": return "Continut"; break;
            case "url": return "Link"; break;
            default: return "-"; break;
        }
    };

    $scope.checkArticleDisabled = function (image) {
        return image.links && image.links.content && !image.links.content.enable;
    };


    $scope.addImage = function(){
        CarouselPublicService.carouselPublic.create({}).$promise.then(function () {
            $scope.refreshTable();
        });
    };

    $scope.deleteImage = function (id) {
        ActionModal.show("Sterge imagine", "Sunteti sigur ca doriti sa stergeti imaginea?", function () {
            CarouselPublicService.carouselPublic.delete({id: id}).$promise.then(function (resp) {
                $state.reload();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Sterge"
        });
    };

    $scope.toggleImageEnable = function (image) {
        ActionModal.show(
            image.enable?"Dezactiveaza imagine":"Activeaza imagine",
            image.enable?"Sunteti sigur ca doriti sa dezactivati imaginea?":"Sunteti sigur ca doriti sa activati imaginea?",
            function () {
                CarouselPublicService.carouselPublic.update({id: image._id}, {enable: !image.enable}).$promise.then(function () {
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