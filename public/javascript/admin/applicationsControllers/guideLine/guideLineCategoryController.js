/**
 * Created by user on 23.10.2015.
 */
controllers.controller('guideLinesCategoryController',['$scope','GuideLineService','Success','ngTableParams','ActionModal','$filter','$state','$modal',function($scope,GuideLineService,Success,ngTableParams,ActionModal,$filter,$state,$modal){

    var refreshCategory = function (){
        GuideLineService.category.query().$promise.then(function(resp){
            var categories = Success.getObject(resp);
            console.log(categories);
            var params = {
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    date_created: 'desc'     // initial sorting
                }
            };
            $scope.tableParams = new ngTableParams(params, {
                total: categories.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(categories, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });

    };

    refreshCategory();


    $scope.addCategory = function(){
        GuideLineService.category.create().$promise.then(function(resp){
            refreshCategory();
        })
    };

    $scope.disableCategory=function (id,category){
        var toEdit = category;
        toEdit.enabled = !toEdit.enabled;

        delete toEdit['_id'];
        GuideLineService.category.update({id:id},toEdit).$promise.then(function(resp){
            refreshCategory();
        }).catch(function(err){

        });

    };

    $scope.editCategory = function(id){
        $modal.open({
            templateUrl: 'partials/admin/applications/guideLines/guidelineCategoryModal.html',
            windowClass: 'fade',
            controller: 'guidelineCategoryModal',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        })
    }

    $scope.removeCategory = function(id){
        ActionModal.show("Stergere categorie", "Sunteti sigur ca doriti sa stergeti categoria?", function () {
            GuideLineService.category.delete({id: id}).$promise.then(function () {
                $state.reload();
            });
        },{
            yes: "Sterge"
        });
    }

}]);