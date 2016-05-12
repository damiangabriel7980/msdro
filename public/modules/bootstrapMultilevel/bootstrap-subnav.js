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

    angular.module('bootstrapSubnav', []).directive('bootstrapSubnav', ['$state', '$timeout', function($state, $timeout) {
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
                stateName: '@',
                stateParameters: '@',
                stateParametersValues: '@',
                activeCondition: '='
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

                scope.closeAllMenus = function(){
                    angular.forEach(angular.element('.subNav'), function(value, key){
                        var listItem = angular.element(value).parent().children('.dropdown-menu');
                        listItem.hide('fast');
                        angular.element(value).find('#caret').removeClass('caret').addClass('caret-right');
                    });
                };

                scope.goToState = function(item){
                    var paramIdentifiers = scope.stateParameters.split(',');
                    var paramValues = scope.stateParametersValues.split(',');
                    var stateParams = {};
                    angular.forEach(paramIdentifiers, function(value, key){
                        stateParams[value] = !isNaN(paramValues[key]) ? paramValues[key] : item[paramValues[key]];
                    });
                    scope.closeAllMenus();
                    $state.go(scope.stateName, stateParams);
                };

                scope.expandParent = function(event){

                    scope.closeAllMenus();

                    var $li = angular.element(event.target).parent(),
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