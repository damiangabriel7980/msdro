/**
 * Created by miricaandrei23 on 26.11.2014.
 */
controllers.controller('Multimedia', ['$scope','$rootScope' ,'MultimediaAdminService','$stateParams','$sce','ngTableParams','$filter','$modal', 'ActionModal','$q','$state', 'Success', 'Error', function($scope,$rootScope,MultimediaAdminService,$stateParams,$sce,ngTableParams,$filter,$modal,ActionModal,$q,$state,Success,Error){
    MultimediaAdminService.multimedia.query().$promise.then(function(result){
        var multimedias = Success.getObject(result);
        console.log(result);
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
            total: multimedias.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(multimedias, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    }).catch(function(err){
        console.log(Error.getMessage(err.data));
    });

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.editMultimedia = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/elearning/multimedia/multimediaEdit.ejs',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            windowClass: 'fade',
            controller:"EditMultimedia",
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        })
    };
    $scope.deleteMultimedia = function (id) {
        ActionModal.show("Stergere material multimedia", "Sunteti sigur ca doriti sa stergeti acest material video?", function () {
            MultimediaAdminService.multimedia.delete({id: id}).$promise.then(function(result){
                console.log(result);
                $state.go('elearning.multimedia',{},{reload: true});
            }).catch(function(err){
                console.log(Error.getMessage(err.data));
            });
        }, "Sterge");
    };
    $scope.toggleMultimedia = function(id, isEnabled){
        ActionModal.show(
            isEnabled?"Dezactiveaza multimedia":"Activeaza multimedia",
            isEnabled?"Sunteti sigur ca doriti sa dezactivati acest material video?":"Sunteti sigur ca doriti sa activati acest material video??",
            function () {
                MultimediaAdminService.multimedia.update({id: id},{enableMultimedia:{isEnabled: !isEnabled}}).$promise.then(function (resp) {
                    console.log(resp);
                    $state.go('elearning.multimedia',{},{reload: true});
                }).catch(function(err){
                    console.log(Error.getMessage(err.data));
                });
            },
            "Da"
        );
    }
}])
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        }
    });
