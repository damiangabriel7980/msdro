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
                scope.selectSize = maxOptionsCount;
                
                scope.$watch("options", function (newVal) {
                    if(newVal) init();
                });

                var init = function () {
                    watchSelection();
                    watchInput();
                };

                var watchSelection = function () {
                    scope.$watch("selected", function (newVal, oldVal) {
                        if(newVal){
                            var selected;
                            if(newVal.length === 0){
                                //prevent selecting none
                                selected = oldVal;
                            }else if(newVal.length > 1){
                                //prevent selecting multiple
                                selected = oldVal.splice(0, 1);
                            }else{
                                selected = newVal;
                            }
                            scope.selected = selected;
                            scope.inputText = selected[0][scope.titleAttr];
                        }
                    });
                };

                var watchInput = function () {
                    scope.$watch("inputText", function (newVal) {
                        if(newVal){
                            var filtered = $filter('filter')(scope.options, {name: newVal});
                            if(filtered.length > maxOptionsCount){
                                scope.selectSize = maxOptionsCount;
                            }else{
                                scope.selectSize = filtered.length;
                            }
                            scope.filteredOptions = filtered;
                        }else{
                            scope.filteredOptions = scope.options.slice(0, maxOptionsCount);
                            scope.selectSize = scope.filteredOptions.length;
                        }
                    });
                };

                scope.showSelect = function () {
                    scope.isSelectVisible = true;
                };
                scope.hideSelect = function () {
                    $timeout(function () {
                        scope.isSelectVisible = false;
                    }, 100);
                };
            }
        };
    }]);
})();