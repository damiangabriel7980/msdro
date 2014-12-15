publicApp.directive('resizable', function($window) {
    return {
        restrict: 'A',
        link: function ($scope, $element, attrs) {

            var ratio = attrs.ratio?attrs.ratio:1;
            var elem = angular.element($element);

            var initializeElementSize = function () {
                var elemWidth = elem[0].offsetWidth;
                var elemHeight = elem[0].offsetHeight;

                elem.css('height', elemWidth/ratio+'px');
            };

            angular.element($window).bind('resize', function () {
                initializeElementSize();
                $scope.$apply();
            });

            // Initiate the resize function default values
            initializeElementSize();
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