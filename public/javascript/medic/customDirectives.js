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
}).directive('convertSpecial', function($sce) {
    return {
        scope: {conver: '='},
        link: function(scope, element, attrs) {
        console.log(scope);
            attrs.$observe('convertSpecial', function() {
                scope.conver = String(scope.conver)
                    .replace('Ă','&#258;')
                    .replace('ă','&#259;')
                    .replace('Â','&Acirc;')
                    .replace('â','&acirc;')
                    .replace('Î','&Icirc;')
                    .replace('î','&icirc;')
                    .replace('Ș','&#x218;')
                    .replace('ș','&#x219;')
                    .replace('Ş','&#350;')
                    .replace('ş','&#351;')
                    .replace('Ț','&#538;')
                    .replace('ț','&#539;')
                    .replace('Ţ','&#354;')
                    .replace('ţ','&#355;');
                return scope.conver;
            });
        }
    }
});
