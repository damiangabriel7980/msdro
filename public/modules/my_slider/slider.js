/**
 * Created by andrei on 20.11.2014.
 */
angular.module('mySlider', []).directive('ngSlidesView', function() {
    return {
        restrict: 'E',
        templateUrl: function(element, attr) {return attr.slidesTemplate},
        scope: {
            otherInput: '=myInput'
        },
        link: function(scope, element, attrs) {
            console.log(attrs);
            var slides = [],
                slideNum = 1,
                urlPrefix = attrs.urlPrefix?attrs.urlPrefix:"",
                pathToSlides = attrs.pathToSlides,
                slidesLoaded = false;

            var renderSlide = function (slideNumber) {
                scope.toRender = urlPrefix+slides[slideNumber-1][pathToSlides];
            };

            scope.$watch('otherInput', function (slidesArray) {
                if(slidesArray){
                    slidesLoaded=true;
                    slides=slidesArray;
                    console.log(slidesArray);
                    slideNum=1;
                    scope.slideToDisplay=1;
                    scope.slidesCount=slidesArray.length;
                    renderSlide(slideNum);
                }else{
                    slidesLoaded=false;
                }
            });

            var goPrevious = function() {
                if (scope.slideToDisplay > 1) {
                    scope.slideToDisplay = scope.slideToDisplay - 1;
                    renderSlide(scope.slideToDisplay);
                }
            };
            var goNext = function() {
                if (scope.slideToDisplay < scope.slidesCount) {
                    scope.slideToDisplay = scope.slideToDisplay + 1;
                    renderSlide(scope.slideToDisplay);
                }
            };

            scope.goPrevious = function() {
                goPrevious();
            };

            scope.goNext = function() {
                goNext();
            };

            //arrow keys events
            var keyHandler = function(e){
                if(e.keyCode === 39 || e.keyCode === 40) {
                    goNext();
                    scope.$apply();
                }
                if(e.keyCode === 37 || e.keyCode === 38) {
                    goPrevious();
                    scope.$apply();
                }
            };
            var $doc = angular.element(document);
            $doc.on('keydown', keyHandler);
            scope.$on('$destroy',function(){
                $doc.off('keydown', keyHandler);
            })
        }
    };
});
