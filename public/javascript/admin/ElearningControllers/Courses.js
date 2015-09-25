/**
 * Created by Administrator on 15/09/15.
 */
controllers.controller('Courses', ['$scope', '$rootScope', '$state', '$stateParams', 'ElearningService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', 'Success', 'Error', function ($scope, $rootScope, $state, $stateParams, ElearningService, AmazonService, $modal, InfoModal, ActionModal, Success, Error) {


    ElearningService.courses.query().$promise.then(function(result){
        $scope.courses = Success.getObject(result);
    }).catch(function(err){
        console.log(Error.getMessage(err));
    });

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.deleteCourse = function (id) {
        ActionModal.show("Stergere curs", "Sunteti sigur ca doriti sa stergeti acest curs?", function () {
            ElearningService.courses.delete({id: id}).$promise.then(function(result){
                $state.reload();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Sterge"
        });
    };
}]);