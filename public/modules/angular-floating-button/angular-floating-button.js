/**
 * Created by andreimirica on 29.04.2016.
 */
/**
 * Created by andreimirica on 13.10.2015.
 */
(function() {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('angularFloatingButton', []).directive('angularFloatingButton', ['$window', function($window) {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('angular-floating-button.js', 'angular-floating-button.html'),
            replace: false,
            link: function(scope, element, attrs) {
                // expose functions
                scope.showButton = false;

                angular.element($window).bind("scroll", function() {
                    if (this.pageYOffset >= 100) {
                        scope.showButton = true;
                    } else {
                        scope.showButton = false;
                    }
                });

                scope.scrollToTop = function () {
                    $window.scrollTo(0, 0);
                }
            }
        };
    }]);
})();