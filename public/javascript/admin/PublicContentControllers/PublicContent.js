controllers.controller('PublicContent', ['$scope', '$rootScope', '$state', '$filter', 'ngTableParams', '$modal', 'ActionModal', 'publicContentService', 'AmazonService', 'Success', 'Error', function($scope, $rootScope, $state, $filter, ngTableParams, $modal, ActionModal, publicContentService, AmazonService, Success, Error){

    $scope.refreshTable = function () {
        publicContentService.publicContent.query().$promise.then(function (resp) {
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

    $scope.addContent = function(){
        $modal.open({
            templateUrl: 'partials/admin/content/publicContent/modalAddPublicContent.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'AddPublicContent'
        });
    };

    $scope.deleteContent = function (id) {
        ActionModal.show("Stergere continut", "Sunteti sigur ca doriti sa stergeti continutul?", function () {
            //remove images
            AmazonService.deleteFilesAtPath('generalContent/'+id, function (err, count) {
                if(err){
                    console.log("Eroare la stergerea continutului");
                }else{
                    console.log("S-au sters "+count+" imagini");
                    //remove content
                    publicContentService.publicContent.delete({id: id}).$promise.then(function (resp) {
                        console.log(resp);
                        $state.reload();
                    }).catch(function(err){
                        console.log(Error.getMessage(err));
                    });
                }
            });
        }, "Sterge");
    };

    $scope.toogleContentEnable = function (id, enabled) {
        ActionModal.show(
            enabled?"Dezactiveaza continut":"Activeaza continut",
            enabled?"Sunteti sigur ca doriti sa dezactivati continutul?":"Sunteti sigur ca doriti sa activati continutul?",
            function () {
                publicContentService.publicContent.update({id: id},{info: {isEnabled: enabled}}).$promise.then(function (resp) {
                    console.log(resp);
                    $state.reload();
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            },
            "Da"
        );
    };

    $scope.editContent = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/content/publicContent/modalEditPublicContent.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'EditPublicContent',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        });
    };
}]);