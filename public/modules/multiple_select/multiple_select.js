var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length-1].src;

angular.module('myMultipleSelect', []).directive('myMultipleSelect', function() {
    return {
        restrict: 'E',
        templateUrl: currentScriptPath.replace('multiple_select.js', 'multiple_select_template.html'),
        replace: true,
        scope: {
            allObjects: '=',
            selectedObjects: '='
        },
        link: function(scope, element, attrs) {
            
            var initialized = false;
            var allObjects = null;

            var trackBy = attrs.trackBy;
            scope.displayBy = attrs.displayBy;

            scope.$watch('allObjects', function () {
                initialize();
            });

            scope.$watch('selectedObjects', function () {
                initialize();
            });
            
            var initialize = function () {
                if(scope.allObjects && scope.selectedObjects && !initialized){
                    initialized = true;
                    for(var i=0; i<scope.allObjects.length; i++){
                        if(findInList(scope.allObjects[i], scope.selectedObjects) != -1){
                            scope.allObjects[i]['selected'] = true;
                        }else{
                            scope.allObjects[i]['selected'] = false;
                        }
                    }
                }
            };

            scope.refreshSelected = function () {
                scope.selectedObjects = [];
                for(var i=0; i<scope.allObjects.length; i++){
                    if(scope.allObjects[i]['selected']){
                        scope.selectedObjects.push(scope.allObjects[i]);
                    }
                }
                console.log(scope.selectedObjects);
            };
            
            var findInList = function (toFind, list) {
                for(var i=0; i<list.length; i++){
                    if(toFind[trackBy]==list[i][trackBy]){
                        return i;
                    }
                }
                return -1;
            };
        }
    };
});