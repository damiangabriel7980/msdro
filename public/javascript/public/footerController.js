/**
 * Created by andrei on 09.01.2015.
 */
publicControllers.controller('FooterController', ['$scope', '$rootScope', '$modal', function ($scope, $rootScope, $modal) {
    //contact modal
    $scope.showContactModal = function(){
        $modal.open({
            templateUrl: 'partials/public/modals/contactModal.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'ContactModalController'
        });
    };
}]);