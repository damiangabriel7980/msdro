(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('myMultipleSelect', []).directive('myMultipleSelect', function() {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('multiple_select.js', 'multiple_select_template.html'),
            replace: true,
            scope: {
                allObjects: '=',
                selectedObjects: '=',
                output: '='
            },
            link: function(scope, element, attrs) {

                var initialized = false;
                var allObjects = null;

                var trackBy = attrs.trackBy;
                scope.displayBy = attrs.displayBy;
                var splitBy = attrs.splitBy;
                scope.split = splitBy?true:false;

                scope.$watch('allObjects', function () {
                    initialize();
                });

                scope.$watch('selectedObjects', function () {
                    initialize();
                });

                var getValueFromKeyChain = function (obj, chain) {
                    for(var i=0; i<chain.length; i++){
                        obj=obj[chain[i]];
                        if(!obj) return null;
                    }
                    return obj;
                };

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
                        scope.refreshSelected();
                        if(splitBy){
                            var tree = {};
                            var branches = [];
                            var keyChain = splitBy.split('.');
                            for(var j=0; j<scope.allObjects.length; j++){
                                var category = getValueFromKeyChain(scope.allObjects[j], keyChain);
                                if(category){
                                    if(!tree[category]){
                                        tree[category] = [];
                                        branches.push(category);
                                    }
                                    tree[category].push(scope.allObjects[j]);
                                }
                            }
                            scope.branches = branches;
                            scope.tree = tree;
                        }
                    }
                };

                scope.refreshSelected = function () {
                    scope.selectedObjects = [];
                    scope.output = [];
                    for(var i=0; i<scope.allObjects.length; i++){
                        if(scope.allObjects[i]['selected']){
                            scope.selectedObjects.push(scope.allObjects[i]);
                            scope.output.push(scope.allObjects[i][trackBy]);
                        }
                    }
                    //console.log(scope.output);
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
})();