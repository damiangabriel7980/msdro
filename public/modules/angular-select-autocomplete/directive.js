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
                ngModel: '=',
                ngOptions: '=',
                titleAttr: '@',
                idAttr: '@',
                onOptionSelect: '=',
                name: '@',
                ngRequired: "="
            },
            link: function(scope, element, attrs, ctrl) {

                var maxOptionsCount = 5;

                //init variables
                scope.showOptions = false;
                scope.highlighted = 0;

                //export functions to scope
                scope.showSelect = showSelect;
                scope.hideSelect = hideSelect;
                scope.selectOption = selectOption;

                scope.$watch("ngOptions", function (newVal) {
                    init();
                });

                scope.$watch("ngModel", function (newVal, oldVal) {
                    if(!oldVal || oldVal[scope.idAttr] !== newVal[scope.idAttr]) init();
                });

                var init = function () {
                    if(scope.ngModel && scope.ngOptions){
                        if(scope.ngModel[scope.idAttr]){
                            if(findOptionById(scope.ngModel[scope.idAttr])){
                                selectOption(scope.ngModel, true, false);
                            }else{
                                unselectOption(true, true);
                            }
                        }
                        watchInput();
                    }
                };

                var watchInput = function () {
                    var filterObj;
                    scope.$watch("inputText", function (newVal) {
                        resetHightlight();
                        checkMatchingText();
                        if(newVal){
                            filterObj = {};
                            filterObj[scope.titleAttr] = newVal;
                            scope.filteredOptions = $filter('filter')(scope.ngOptions, filterObj).slice(0, maxOptionsCount);
                        }else{
                            scope.filteredOptions = scope.ngOptions.slice(0, maxOptionsCount);
                        }
                    });
                };

                function findOptionById (id) {
                    for(var i=0; i<scope.ngOptions.length; i++){
                        if(scope.ngOptions[i][scope.idAttr] === id) return scope.ngOptions[i];
                    }
                    return null;
                }

                function showSelect () {
                    scope.showOptions = true;
                }
                function hideSelect() {
                    $timeout(function () {
                        scope.showOptions = false;
                    }, 100);
                }
                function selectOption(option, updateInput, updateModel) {
                    scope.selected = option;
                    if(updateModel) scope.ngModel = option;
                    if(updateInput) scope.inputText = option[scope.titleAttr];
                    if(scope.onOptionSelect && updateModel) scope.onOptionSelect(option);
                }
                function unselectOption(clearInput, updateModel) {
                    scope.selected = null;
                    if(clearInput) scope.inputText = "";
                    if(updateModel) scope.ngModel = {};
                    if(scope.onOptionSelect && updateModel) scope.onOptionSelect({});
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
                    selectOption(scope.filteredOptions[scope.highlighted], true, true);
                }

                function checkMatchingText() {
                    var fo = scope.filteredOptions;
                    var it = scope.inputText;
                    if(it && fo && fo.length === 1 && fo[0][scope.titleAttr].toLowerCase() === it.toLowerCase()){
                        selectOption(fo[0], false, true);
                    }else{
                        unselectOption(false, true);
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