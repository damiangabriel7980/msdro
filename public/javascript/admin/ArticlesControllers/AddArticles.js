/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('AddArticles', ['$scope', 'ContentService', '$modalInstance', '$state', function($scope, ContentService, $modalInstance, $state){

    $scope.tinymceOptions = {
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        height: 500,
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

    $scope.selectedGroups = [];

    ContentService.content.query().$promise.then(function(result) {
        $scope.groups = result['groups'];
    });

    $scope.createArticle=function(){
        var id_groups=[];
        for(var i=0;i<$scope.selectedGroups.length;i++){
            id_groups.push($scope.selectedGroups[i]._id);
        }
        $scope.articolNou.groupsID=id_groups;
        $scope.articolNou.enable = false;
        $scope.articolNou.created = Date.now();
        $scope.articolNou.last_updated = Date.now();
        ContentService.content.create({article: $scope.articolNou}).$promise.then(function (resp) {
            $modalInstance.close();
            $state.go('content.articles',{},{reload: true});
        });
    };

    $scope.closeModal = function () {
        $modalInstance.close();
        $state.go('content.articles',{},{reload: true});
    };
}]);
