/**
 * Created by user on 23.10.2015.
 */
controllers.controller('guideLinesCategoryController',['$scope','GuideLineService','Success','ngTableParams','ActionModal','$filter','$state','$modal','AmazonService',function($scope,GuideLineService,Success,ngTableParams,ActionModal,$filter,$state,$modal,AmazonService){

    var refreshCategory = function (){
        GuideLineService.category.query().$promise.then(function(resp){
            var categories = Success.getObject(resp);
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
            $state.reload();
        })
    };

    $scope.disableCategory=function (id,category){
        console.log(category);
       ActionModal.show(category.enabled?"Dezactiveaza categorie":"Activeaza categorie",
           category.enabled?"Sunteti sigur ca doriti sa dezactivati categoria?":"Sunteti sigur ca doriti sa activati categoria?",function(){
               var toEdit = category;
               toEdit.enabled = !toEdit.enabled;

               delete toEdit['_id'];
               GuideLineService.category.update({id:id},toEdit).$promise.then(function(resp){
                   refreshCategory();
               }).catch(function(err){

               });}
           ,{
               yes:"Da"
           });

    };

    $scope.editCategory = function(id){
        $modal.open({
            templateUrl: 'partials/admin/applications/guideLines/guidelineCategoryModal.html',
            windowClass: 'fade stretch',
            controller: 'guidelineCategoryModal',
            backdrop:'static',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        })
    }

    var deleteFromAmazon = function(path){
       if(path){
           var filePath = path.substring(AmazonService.getBucketUrl().length);
           AmazonService.deleteFile(filePath, function (err, success) {
               if(err){
                   ActionModal.show("Eroare la stergerea fisierului");
               }else{
    
               }
           })
       }
    };

    $scope.removeCategory = function(id,path){

        ActionModal.show("Stergere categorie", "Sunteti sigur ca doriti sa stergeti categoria?", function () {
            GuideLineService.category.delete({id: id}).$promise.then(function () {
                deleteFromAmazon(path);
                $state.reload();
            });
        },{
            yes: "Sterge"
        });
    }

}]);