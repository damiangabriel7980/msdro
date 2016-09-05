/**
 * Created by andrei.mirica on 09/08/16.
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
            scope: {
              triggeringPoint: '='
            },
            link: function(scope, element, attrs) {
                // expose functions
                scope.showButton = false;

                angular.element($window).bind("scroll", function() {
                    //if the scroll has reached the triggering point, display the scroll to top button
                    var scrollPosition = $window.scrollY || $window.pageYOffset;
                    if (scrollPosition > (scope.triggeringPoint ? scope.triggeringPoint : 0)) {
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