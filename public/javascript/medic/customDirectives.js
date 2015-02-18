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
}).directive('thereIsMore', function($timeout,$document,$window) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var footer = angular.element('#footer');
            var check = function () {
                //if(angular.element($window).scrollTop()===0&&angular.element($document).height() >= (angular.element($window).height() + angular.element($window).scrollTop()))
                //    f.hide();
                if (angular.element($document).height() <= (angular.element($window).height() + angular.element($window).scrollTop()))
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
});
