/**
 * Created by andrei on 25.11.2014.
 */
controllers.controller('Groups', ['$scope', '$rootScope', '$state', '$stateParams','$filter', 'ngTableParams' ,'GroupsService', '$modal', 'InfoModal', 'ActionModal', 'AmazonService', function($scope, $rootScope, $state, $stateParams, $filter, ngTableParams, GroupsService, $modal, InfoModal, ActionModal, AmazonService){

    $scope.refreshTable = function () {
        GroupsService.groups.query().$promise.then(function (resp) {
            var data = resp.success;

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    display_name: 'asc'     // initial sorting
                },
                filter: {
                    display_name: ''       // initial filter
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

    $scope.addGroup = function(){
        $modal.open({
            templateUrl: 'partials/admin/users/groups/modalAddGroup.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'AddGroup'
        });
    };

    $scope.deleteGroup = function (group) {
        console.log(group);
        if(group.restrict_CRUD){
            InfoModal.show("Operatie nepermisa", "Nu aveti voie sa stergeti acest grup");
        }else{
            ActionModal.show("Stergere grup", "Sunteti sigur ca doriti sa stergeti acest grup?", function () {
                AmazonService.deleteFile(group.image_path, function (err, succes) {
                    if(err){
                        console.log(err);
                    }else{
                        GroupsService.groups.delete({id: group._id}).$promise.then(function (resp) {
                            console.log(resp);
                            $state.reload();
                        });
                    }
                });
            }, "Sterge");
        }
    };
    $scope.editGroup = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/users/groups/modalEditGroup.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'EditGroup',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        });
    };

}]);