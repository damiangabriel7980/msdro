/**
 * Created by miricaandrei23 on 18.06.2015.
 */
(function() {
    'use strict';
    angular.module('footerResponsive', []).directive('footerResponsive', function($window,$timeout) {
        return {
        restrict: 'EA',
            templateUrl: function(element, attr) {
                return attr.templateLink;
            },
            transclude: true,
            scope: {
            stickBelowId: '@',
            templateLink: '@'
        },
        link: function (scope, element, attrs) {
            var footerElement;
            var content;
            var calculatePadding = function(){
                footerElement = angular.element(element[0].firstChild);
                content = angular.element('#'+ scope.stickBelowId)[0];
                var heightOfContent = content.getBoundingClientRect().bottom + element[0].firstChild.offsetHeight;
                var windowHeight = angular.element($window)[0].innerHeight;
                if(heightOfContent > windowHeight)
                    footerElement.css('margin-top',0);
                else
                    footerElement.css('margin-top',windowHeight - heightOfContent);
            };

            var continuousRefresh = function () {
                calculatePadding();
                $timeout(continuousRefresh, 300);
            };

            angular.element($window).bind('resize', function () {
                calculatePadding();
                scope.$apply();
            });

            angular.element(document).ready(function () {
                continuousRefresh();
            });
        }
        };
    });
})();