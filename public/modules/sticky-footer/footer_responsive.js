/**
 * Created by miricaandrei23 on 18.06.2015.
 */
(function() {
    'use strict';
    angular.module('footerResponsive', []).directive('footerResponsive', ['$window', '$timeout', '$document', function($window, $timeout, $document) {
        return {
        restrict: 'EA',
            templateUrl: function(element, attr) {
                return attr.templateLink;
            },
            priority: -1000,
            transclude: true,
            scope: {
            stickBelowId: '@',
            templateLink: '@'
        },
        link: function (scope, element, attrs) {
            var footerElement;
            var content;
            footerElement = angular.element(element[0].firstChild);
            footerElement.hide();
            var checkScroll = function(){
                content = angular.element('#'+ scope.stickBelowId)[0];
                scope.heightOfContent = content.offsetTop + content.offsetHeight;
                if (angular.element($document).height() <= (angular.element($window).height() + angular.element($window).scrollTop()) + 86){
                    footerElement.show();
                    footerElement.css({'position': 'fixed','bottom':0});
                }
                else if(angular.element($document).height() > (angular.element($window).height()))
                {
                    footerElement.hide();
                    footerElement.css({'position': 'relative','bottom':0});
                }
            };


            var continuousRefresh = function () {
                checkScroll();
                $timeout(continuousRefresh, 300);
            };

            angular.element($window).scroll(function () {
                //appliedCheck();
                checkScroll();
            });

            angular.element($window).bind('resize', function () {
                checkScroll();
                scope.$apply();
            });

            angular.element(document).ready(function () {
                continuousRefresh();
            });
        }
        };
    }]);
})();