/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('articlesAddCtrl', ['$scope', 'ContentService', '$modalInstance', '$state', function($scope, ContentService, $modalInstance, $state){

    $scope.tinymceOptions = {
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

    $scope.selectedGroups = [];

    ContentService.getAll.query().$promise.then(function(result) {
        $scope.groups = result['groups'];
    });

    $scope.createArticle=function(){
        var id_groups=[];
        for(var i=0;i<$scope.selectedGroups.length;i++){
            id_groups.push($scope.selectedGroups[i]._id);
        }
        $scope.articolNou.groupsID=id_groups;

        ContentService.getAll.save($scope.articolNou).$promise.then(function (resp) {
            console.log(resp);
            $state.reload();
            $modalInstance.close();
        });
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    };
}]);
