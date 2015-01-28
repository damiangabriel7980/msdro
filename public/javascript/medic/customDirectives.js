/**
 * Created by andrei on 03.12.2014.
 */
//similar use as ng-src. Forces server to request image, instead of loading it from cache
cloudAdminApp.directive('noCacheSrc', function($window) {
    return {
        priority: 99,
        link: function(scope, element, attrs) {
            attrs.$observe('noCacheSrc', function(noCacheSrc) {
                noCacheSrc += '?' + (new Date()).getTime();
                attrs.$set('src', noCacheSrc);
            });
        }
    }
}).directive('carouselResizable', function($window) {
    return {
        restrict: 'A',
        link: function ($scope, $element) {

            $scope.initializeWindowSize = function () {
                $scope.elementWidth = angular.element($element)[0].offsetWidth;
                //$scope.elementHeight = angular.element($element)[0].offsetHeight;

                var carouselH = $scope.elementWidth / 4;

                $scope.carouselResponsiveStyle = 'height:' + carouselH + 'px;';
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