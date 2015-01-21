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
            initializeElementSize();
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
});