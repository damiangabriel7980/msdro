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

    angular.module('bootstrapSubnav', []).directive('bootstrapSubnav', ['$window', '$timeout', function($window, $timeout) {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('bootstrap-subnav.js', 'bootstrap-subnav.html'),
            replace: true,
            scope: {
                objectsArray: '=',
                menuTitle: '@',
                childrenProperty: '@',
                clickOnFinalChild: '@',
                parentDisplayName: '@',
                childDisplayName: '@',
                navigateTo: '@'
            },
            link: function(scope, element, attrs) {
                // expose functions

                scope.$watch('objectsArray', function () {
                    if(scope.objectsArray && scope.objectsArray[0]){
                        onInitialize();
                    }
                });

                var onInitialize = function(){
                    $timeout(function () {
                        var $dropDownTrigger = angular.element('li.dropdown li.dropdown');
                        $dropDownTrigger.find('.dropdown-menu').hide();
                        $dropDownTrigger.find('.caret').removeClass('caret').addClass('caret-right');
                    },0);
                };

                scope.isSubCollapsed = true;

                scope.expandParent = function(event){

                    angular.forEach(angular.element('.subNav'), function(value, key){
                        var listItem = angular.element(value).children('.dropdown-menu');
                        listItem.hide('fast');
                        listItem.find('.caret-right, .caret').removeClass('caret').addClass('caret-right');
                    });

                    var $li = angular.element(event.target),
                        $menu = $li.children('.dropdown-menu'),
                        $caret = $li.find('.caret-right, .caret');

                    if($menu.length){
                        event.stopPropagation();
                        event.preventDefault();
                    }

                    if($menu.is(':visible')) {
                        $menu.hide('fast');
                        $caret.removeClass('caret').addClass('caret-right');
                    } else {
                        $menu.show('fast');
                        $caret.addClass('caret').removeClass('caret-right');
                    }
                }
            }
        };
    }]);
})();