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
                scope.highlighted = 0;

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
                        resetHightlight();
                        unselectOption();
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
                        checkMatchingText();
                    }, 100);
                }
                function selectOption(option) {
                    scope.selected = option;
                    scope.inputText = option[scope.titleAttr];
                    console.log("selected");
                }
                function unselectOption() {
                    scope.selected = null;
                }
                function highlightPrevious() {
                    if(scope.highlighted > 0) {
                        scope.$apply(function () {
                            scope.highlighted --;
                        });
                    }
                }
                function highlightNext() {
                    if(scope.highlighted < scope.filteredOptions.length - 1) {
                        scope.$apply(function () {
                            scope.highlighted ++;
                        });
                    }
                }
                function resetHightlight() {
                    scope.highlighted = 0;
                }
                function selectHighlighted() {
                    selectOption(scope.filteredOptions[scope.highlighted]);
                }

                function checkMatchingText() {
                    var fo = scope.filteredOptions;
                    var it = scope.inputText;
                    if(it && fo && fo.length === 1 && fo[0][scope.titleAttr].toLowerCase() === it.toLowerCase()){
                        selectOption(fo[0]);
                    }
                }

                //event for up arrow / down arrow / enter (key codes: 38 / 40 / 13) on input
                angular.element(element[0].children[0].children[0].children[0]).on("keydown", function (event) {
                    //console.log(event.keyCode);
                    if([38, 40, 13].indexOf(event.keyCode) === -1) return;
                    event.preventDefault();
                    switch(event.keyCode){
                        case 38: highlightPrevious(); break;
                        case 40: highlightNext(); break;
                        case 13: selectHighlighted(); break;
                    }
                });
            }
        };
    }]);
})();