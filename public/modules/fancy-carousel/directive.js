(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;
    angular.module('fancyCarousel', [])
        .filter('repeatReverse', function() {
            return function(items) {
                return items.slice().reverse();
            };
        })
        .directive('fancyCarousel', ['$sce', function($sce) {
            return {
                restrict: 'E',
                templateUrl: currentScriptPath.replace('directive.js', 'template.html'),
                replace: true,
                scope: {
                    carouselSlides: '=',
                    carouselAction: '=',
                    pathPrefix: '=',
                    slideSeconds: '=',
                    wHRatio: '='
                },
                link: function(scope, element, attrs) {

                    scope.selectedIndex = 0;
                    scope.setSlide = function(index) {
                        scope.selectedIndex = index;
                    };

                    scope.$watch('carouselSlides', function () {
                        if(scope.carouselSlides && scope.carouselSlides[0]){
                            scope.selectedIndex = 0;
                        }
                    });

                    var htmlToPlainText = function(text) {
                        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
                    };

                    scope.createHeader = function (text,length) {
                        var textLength = text?text.length:0;
                        if(textLength > length){
                            var trimmed = htmlToPlainText(text).substring(0,length);
                            var i = trimmed.length;
                            while(trimmed[i]!=' ' && i>0) i--;
                            trimmed = trimmed.substr(0, i);
                            if(trimmed.length > 0) trimmed = trimmed+"...";
                            return trimmed;
                        }else{
                            return htmlToPlainText(text);
                        }
                    };

                    scope.trustAsHtml = function (res) {
                        return $sce.trustAsHtml(res);
                    };

                    scope.getTooltip = function (slide) {
                        var src = scope.pathPrefix + slide.image_path;
                        var tooltipContent = '<img src="'+src+'">'+scope.createHeader(slide.title, 40);
                        return $sce.trustAsHtml(tooltipContent);
                    };

                }
            };
        }])
        .directive('carouselResizable', ['$window', function($window) {
            return {
                restrict: 'A',
                link: function ($scope, $element) {

                    var elementWidth;
                    var element = angular.element($element);
                    var divToResize = element.find('#divToResize');

                    var initializeElementSize = function () {
                        elementWidth = element[0].offsetWidth;

                        var carouselH = Math.round(elementWidth * ($scope.wHRatio || 0.3));

                        divToResize.css('height', carouselH+'px');
                    };

                    angular.element($window).bind('resize', function () {
                        initializeElementSize();
                    });

                    // Initiate the resize function default values
                    angular.element(document).ready(function () {
                        initializeElementSize();
                        //$scope.$apply();
                    });

                    $scope.$on('destroy', function () {
                        angular.element($window).unbind('resize');
                    });

                }
            }
        }])
})();