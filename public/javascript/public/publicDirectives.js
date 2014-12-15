publicApp.directive('resizable', function($window) {
    return {
        restrict: 'A',
        link: function ($scope, $element) {

            $scope.initializeWindowSize = function () {
                $scope.elementWidth = angular.element($element)[0].offsetWidth;
                $scope.elementHeight = angular.element($element)[0].offsetHeight;
            };

            angular.element($window).bind('resize', function () {
                $scope.initializeWindowSize();
                $scope.$apply();
            });

            // Initiate the resize function default values
            $scope.initializeWindowSize();
        }
    }
});
publicApp.directive('carouselResizable', function($window) {
    return {
        restrict: 'A',
        link: function ($scope, $element) {

            $scope.initializeWindowSize = function () {
                $scope.elementWidth = angular.element($element)[0].offsetWidth;
                $scope.elementHeight = angular.element($element)[0].offsetHeight;

                var carouselH = $scope.elementWidth / 3;
                var offset_Y = carouselH / 10;

                $scope.carouselStyle = 'height:' + carouselH + 'px;' +
                    'width:' + ($scope.elementWidth) + 'px;';

                $scope.fixedBoxStyle = 'top:' + offset_Y + 'px;' +
                    'height:' + (carouselH - (2 * offset_Y)) + 'px;' +
                    'width:' + ($scope.elementWidth / 2) + 'px;';

                $scope.cNavStyle = 'bottom:' + offset_Y + 'px;' +
                    'width:' + ($scope.elementWidth / 2 - 40) + 'px;';
            };

            angular.element($window).bind('resize', function () {
                $scope.initializeWindowSize();
                $scope.$apply();
            });

            // Initiate the resize function default values
            $scope.initializeWindowSize();
        }
    }
});