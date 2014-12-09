publicApp.directive('resize', function ($window) {
    return function (scope, element) {
        scope.getWindowDimensions = function () {
            return {
                'h': window.innerHeight,
                'w': window.innerWidth
            };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            var carouselH = newValue.w / 3;

            scope.carouselStyle = 'height:'+carouselH+'px;'+
                                  'width:'+(newValue.w)+'px;';

            var boxOffset = newValue.h/20;

            scope.fixedBoxStyle = 'top:'+boxOffset+'px;'+
                                  'height:'+(carouselH - (2*boxOffset))+'px;'+
                                  'width:'+(newValue.w /2)+'px;';

        }, true);

        var w = angular.element($window);
        w.bind('resize', function () {
            scope.$apply();
        });
    }
});