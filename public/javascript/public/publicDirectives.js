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

            var resizeT;

            var initializeElementSize = function () {
                $scope.elementWidth = angular.element($element)[0].offsetWidth;
                //$scope.elementHeight = angular.element($element)[0].offsetHeight;

                var carouselH = Math.round($scope.elementWidth / 3);

                $scope.carouselStyle = 'height:' + carouselH + 'px;' +
                    'width:' + ($scope.elementWidth) + 'px;';

            };

            angular.element($window).bind('resize', function () {
                if($scope.$state.includes('home')){
                    initializeElementSize();
                    //wait for resizing to finish
                    clearTimeout(resizeT);
                    resizeT = setTimeout(doneResizing, 700);
                    $scope.$apply();
                }else{
                    angular.element($window).unbind('resize');
                }
            });

            function doneResizing(){
                //reload state to fix carousel locking bug
                $scope.$state.reload();
            }

            // Initiate the resize function default values
            angular.element(document).ready(function () {
                initializeElementSize();
                $scope.$apply();
            });

        }
    }
});
publicApp.directive('scrollcenter', function($window) {
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
}).directive('convertSpecial', function() {
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
publicApp.directive('footerBottom', function($window, $rootScope, $timeout, $state) {
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
            var lastHeight = 0;
            var padding;

            var initialize = function () {
                containerHeight = container.offsetHeight;
                if(containerHeight != lastHeight){
                    lastHeight = containerHeight;
                    windowHeight = angular.element($window)[0].innerHeight;
                    padding = windowHeight - containerHeight - fixedOffset;
                    if(padding>0){
                        footer.css('padding-top',padding+'px');
                    }else{
                        footer.css('padding-top','0px');
                    }
                }
            };

            angular.element($window).bind('resize', function () {
                initialize();
                $scope.$apply();
            });

            angular.element(document).ready(function () {
                initialize();
                $scope.$apply();
            });

            $rootScope.$on('$stateChangeStart',
                function(){
                    footer.css('padding-top','0px');
                });

            $rootScope.$on('$viewContentLoaded',
                function(){
                    $timeout(initialize, 300);
                });
        }
    }
});