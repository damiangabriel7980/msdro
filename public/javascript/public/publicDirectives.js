publicApp.directive('resizable', function($window) {
    return function ($scope) {

        // On window resize => resize the app
        $scope.initializeWindowSize = function () {
            $scope.windowHeight = $window.innerHeight;
            $scope.windowWidth = $window.innerWidth;

            var carouselH = $scope.windowWidth / 3;

            $scope.carouselStyle = 'height:' + carouselH + 'px;' +
                'width:' + ($scope.windowWidth) + 'px;';

            var offset_Y = $scope.windowHeight / 20;

            $scope.fixedBoxStyle = 'top:' + offset_Y + 'px;' +
                'height:' + (carouselH - (2 * offset_Y)) + 'px;' +
                'width:' + ($scope.windowWidth / 2) + 'px;';

            $scope.cNavStyle = 'bottom:' + offset_Y + 'px;' +
                'width:' + ($scope.windowWidth / 2 - 40) + 'px;';
        };

        angular.element($window).bind('resize', function () {
            $scope.initializeWindowSize();
            $scope.$apply();
        });

        // Initiate the resize function default values
        $scope.initializeWindowSize();


    };
});