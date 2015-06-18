app.directive('resizable', ['$window', function($window) {
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
}]);
app.directive('scrollcenter', ['$window', function($window) {
    return {
        restrict: 'A',
        link: function ($scope, $element, attrs) {

            var elem = angular.element($element);

            var initializeElementSize = function () {
                var elemWidth = elem[0].offsetWidth;
                var scrollWidth = elem[0].scrollWidth;

                if(scrollWidth > elemWidth){
                    elem[0].scrollLeft = (scrollWidth - elemWidth) / 2;
                }
            };

            angular.element($window).bind('resize', function () {
                initializeElementSize();
                $scope.$apply();
            });

            // Initiate the resize function default values
            angular.element(document).ready(function () {
                initializeElementSize();
            });
        }
    }
}]).directive('convertSpecial', function() {
    return {
        scope: {toConvert: '='},
        link: function(scope, element, attrs) {

            var convertStr = function (val) {
                return String(val || "")
                    .replace(/Ă/g,'&#258;')
                    .replace(/ă/g,'&#259;')
                    .replace(/Â/g,'&Acirc;')
                    .replace(/â/g,'&acirc;')
                    .replace(/Î/g,'&Icirc;')
                    .replace(/î/g,'&icirc;')
                    .replace(/Ș/g,'&#x218;')
                    .replace(/ș/g,'&#x219;')
                    .replace(/Ş/g,'&#350;')
                    .replace(/ş/g,'&#351;')
                    .replace(/Ț/g,'&#538;')
                    .replace(/ț/g,'&#539;')
                    .replace(/Ţ/g,'&#354;')
                    .replace(/ţ/g,'&#355;');
            };

            attrs.$observe('convertSpecial', function () {
                scope.toConvert = convertStr(scope.toConvert);
                return scope.toConvert;
            });
        }
    }
});
app.directive('footerBottom', ['$window', '$rootScope', '$timeout', '$state', function($window, $rootScope, $timeout, $state) {
    return {
        restrict: 'A',
        link: function ($scope, $element, attrs) {

            //var footerHeight = 88;
            //var headerHeight = 70;
            var fixedOffset = 180;

            var content = angular.element($element);
            var container = angular.element(content[0].children[0])[0];
            var footer = angular.element(content[0].children[1]);

            var containerHeight;
            var windowHeight;
            var padding;
            var calculatedPadding;

            var stateIsChanging = false;
            var lockInit = false;

            var initialize = function () {
                if(!lockInit){
                    lockInit = true;
                    if(!stateIsChanging){
                        //
                        containerHeight = container.offsetHeight;
                        windowHeight = angular.element($window)[0].innerHeight;
                        calculatedPadding = windowHeight - containerHeight - fixedOffset;
                        if(calculatedPadding < 0) calculatedPadding = 0;
                        if(calculatedPadding != padding){
                            padding = calculatedPadding;
                            //
                            footer.css('padding-top',padding+'px');
                        }
                    }
                    lockInit = false;
                }
            };

            var continuousRefresh = function () {
                initialize();
                $timeout(continuousRefresh, 300);
            };

            angular.element($window).bind('resize', function () {
                initialize();
                $scope.$apply();
            });

            angular.element(document).ready(function () {
                continuousRefresh();
                $scope.$apply();
            });

            $rootScope.$on('$stateChangeStart',
                function(){
                    stateIsChanging = true;
                    padding = 0;
                    footer.css('padding-top','0px');
                });

            $rootScope.$on('$viewContentLoaded',
                function(){
                    stateIsChanging = false;
                });
        }
    }
}]);