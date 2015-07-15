/**
 * Created by andrei on 03.12.2014.
 */
//similar use as ng-src. Forces server to request image, instead of loading it from cache
app.directive('noCacheSrc', ['$window', function($window) {
    return {
        priority: 99,
        link: function(scope, element, attrs) {
            attrs.$observe('noCacheSrc', function(noCacheSrc) {
                noCacheSrc += '?' + (new Date()).getTime();
                attrs.$set('src', noCacheSrc);
            });
        }
    }
}]).directive('resizable', ['$window', function($window) {
    return {
        restrict: 'A',
        scope: {
            'altIf': '='
        },
        link: function ($scope, $element, attrs) {

            var ratio = attrs.ratio?attrs.ratio:1;
            var elem = angular.element($element);
            var elemWidth;

            var initializeElementSize = function () {
                elemWidth = elem[0].offsetWidth;
                if($scope.altIf){
                    elem.css('height', elemWidth/ratio+'px');
                }else{
                    if(attrs.altRatio){
                        elem.css('height', elemWidth/attrs.altRatio+'px');
                    }else{
                        elem.css('height', '100%');
                    }
                }
            };

            angular.element($window).bind('resize', function () {
                initializeElementSize();
                $scope.$apply();
            });

            // Initiate the resize function default values
            angular.element(document).ready(function () {
                initializeElementSize();
                //$scope.$apply();
            });

        }
    }
}]).directive('carouselResizable', ['$window', function($window) {
    return {
        restrict: 'A',
        link: function ($scope, $element) {

            var element = angular.element($element);
            var elementWidth;
            var carouselH;

            $scope.initializeWindowSize = function () {
                elementWidth = element[0].offsetWidth;

                carouselH = elementWidth / 4;

                element.css('height',carouselH+'px');
            };

            angular.element($window).bind('resize', function () {
                $scope.initializeWindowSize();
                $scope.$apply();
            });

            // Initiate the resize function default values
            $scope.initializeWindowSize();
        }
    }
}]).directive('convertSpecial', ['$sce','Diacritics', function($sce,Diacritics) {
    return {
        scope: {conver: '='},
        link: function(scope, element, attrs) {
            attrs.$observe('convertSpecial', function() {
                return Diacritics.diacriticsToHtml(scope.conver);
            });
        }
    }
}]);
app.directive('coverScreeen', ['$window', function ($window) {
    return{
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            var occupiedSpace = $attrs.occupiedSpace || 0;
            var runOnState = $attrs.runOnState;

            var elementWidth;
            var elementHeight;

            var element = angular.element($element);
            var window = angular.element($window);

            var initializeElementSize = function () {
                elementWidth = window[0].innerWidth;
                elementHeight = window[0].innerHeight - occupiedSpace;

                element.css('width', '100%');
                element.css('height', elementHeight+'px');
            };

            angular.element($window).bind('resize', function () {
                if($scope.$state.includes(runOnState)){
                    initializeElementSize();
                    $scope.$apply();
                }else{
                    angular.element($window).unbind('resize');
                }
            });

            // Initiate the resize function default values
            angular.element(document).ready(function () {
                initializeElementSize();
                //$scope.$apply();
            });
        }
    }
}]);