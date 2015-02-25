/**
 * Created by miricaandrei23 on 21.11.2014.
 */
controllers.controller('Contact',['$scope','$modalInstance', function ($scope, $modalInstance) {

    $scope.closeContact = function () {
        $modalInstance.close();
    };
}]);