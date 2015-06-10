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
}]).directive('convertSpecial', ['$sce', function($sce) {
    return {
        scope: {conver: '='},
        link: function(scope, element, attrs) {
            attrs.$observe('convertSpecial', function() {
                scope.conver = String(scope.conver)
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
                return scope.conver;
            });
        }
    }
}]).directive('thereIsMore', ['$timeout', '$document', '$window', function($timeout,$document,$window) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var footer = angular.element('#footer');
            var check = function () {
                //if(angular.element($window).scrollTop()===0&&angular.element($document).height() >= (angular.element($window).height() + angular.element($window).scrollTop()))
                //    f.hide();
                if (angular.element($document).height() <= (angular.element($window).height() + angular.element($window).scrollTop()) + 86)
                    footer.show();
                else
                    footer.hide();
            };
            var appliedCheck = function () {
                scope.$apply(check);
            };
            angular.element($window).scroll(function () {
                //appliedCheck();
                check();
            });
            check();
            $timeout(function(){
                check();
            }, 1000);
            angular.element($window).resize(function () {
                //appliedCheck();
                check();
            });
            angular.element(document).ready(function(){
                //appliedCheck();
                check();
            });
            angular.element(document).ajaxComplete(function(){
                //appliedCheck();
                check();
            });
            scope.$on('$viewContentLoaded',
                function(event){
                    $timeout(function(){
                        check();
                    }, 500)
                });
            //scope.$on('$stateChangeSuccess',
            //    function(event){
            //        check();
            //    });
        } // end of link
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
app.directive('buffering',['$timeout','$document', function ($timeout,$document) {
    return {
        restrict: 'A',
        link: function(rootscope,scope, element, attrs) {
            //var checkVideo = function(){
            //    $('video').on('suspend', function (event) {
            //        $(this).css('background-image',rootscope.loaderForSlowConn);
            //    });
            //    $('video').on('canplay', function (event) {
            //        $(this).css('background-image','none');
            //    });
            //};
            //angular.element(document).ready(function(){
            //    checkVideo();
            //});
            //angular.element(document).ajaxComplete(function(){
            //    checkVideo();
            //});
        }
    }
}]);
