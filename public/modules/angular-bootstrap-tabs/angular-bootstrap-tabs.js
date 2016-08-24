/**
 * Created by andrei.mirica on 09/08/16.
 */
(function() {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;
    /**
     * @ngdoc directive
     * @name angularBootstrapTabs
     * @scope
     * @restrict E
     *
     * @description
     * Create a set of tabs for description fields of an object
     *
     * @param {Array} tabs - An array of objects used for displaying the tabs. Each object must have the following properties:
     * title: the title of the tab
     * model: the model to bind with (text to display in text area),
     * propertyUsedToBind : the property of the object used to bind the text in the textarea
     *
     * After making changes in the text area, you must loop to the tabs array an get the new text
     *
     * EX.
     * angular.forEach($scope.editableTabs, function (value, key) {
     *       $scope.objectForBinding[value.propertyUsedToBind] = value.model;
     * });
     *
     * @param {Object} editorOptions - since the editor is based on UI-tinyMCE, you must pass an object for configuring tinyMCE
     */
    angular.module('angularBootstrapTabs', []).directive('angularBootstrapTabs', ['$window', function($window) {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('angular-bootstrap-tabs.js', 'angular-bootstrap-tabs.html'),
            replace: true,
            scope: {
              tabs: '=',
                editorOptions: '='
            },
            link: function(scope, element, attrs) {
                scope.showTab = function (tabName) {
                    scope.activeTab = tabName;
                };
                scope.$watch('tabs', function(newValue, oldValue){
                    if (newValue) {
                        scope.activeTab = scope.tabs[0].title;
                    }
                });
            }
        };
    }]);
})();