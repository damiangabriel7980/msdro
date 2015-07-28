(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath;
    for(var i=0; i<scripts.length; i++){
        if(scripts[i].src.indexOf("angular-select-autocomplete") > -1) currentScriptPath = scripts[i].src;
    }

    angular.module('angularSelectAutocomplete', []).directive('angularSelectAutocomplete', ['$timeout', '$filter', function($timeout, $filter) {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('directive.js', 'template.html'),
            scope: {
                options: '=',
                titleAttr: '@',
                idAttr: '@'
            },
            link: function(scope, element, attrs) {

                var maxOptionsCount = 5;

                //init variables
                scope.maxOptionsCount = maxOptionsCount;
                scope.showOptions = false;

                //export functions to scope
                scope.showSelect = showSelect;
                scope.hideSelect = hideSelect;
                scope.selectOption = selectOption;

                scope.$watch("options", function (newVal) {
                    if(newVal) init();
                });

                var init = function () {
                    watchInput();
                };

                var watchInput = function () {
                    scope.$watch("inputText", function (newVal) {
                        if(newVal){
                            scope.filteredOptions = $filter('filter')(scope.options, {name: newVal});
                        }else{
                            scope.filteredOptions = scope.options.slice(0, maxOptionsCount);
                        }
                    });
                };

                function showSelect () {
                    scope.showOptions = true;
                }
                function hideSelect() {
                    $timeout(function () {
                        scope.showOptions = false;
                    }, 100);
                }
                function selectOption(option) {
                    scope.selected = option;
                    scope.inputText = option[scope.titleAttr];
                }
            }
        };
    }]);
})();