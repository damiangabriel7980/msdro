(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('adminEditableSingleList', []).directive('adminEditableSingleList', function() {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('directive.js', 'template.html'),
            replace: true,
            scope: {
                ngModel: '=',
                title: '@'
            },
            link: function(scope, element, attrs) {
                scope.addItem = function () {
                    if(scope.itemName){
                        modelInsertItem(scope.itemName);
                        scope.itemName = null;
                    }
                };

                scope.removeItem = function (name) {
                    scope.ngModel.splice(getItemIndex(name), 1);
                };

                function modelInsertItem(name) {
                    if(!scope.ngModel) scope.ngModel = [];
                    if(getItemIndex(name)===null) scope.ngModel.push(name);
                }

                function getItemIndex(name) {
                    var idx = scope.ngModel.indexOf(name);
                    if(idx === -1){
                        return null;
                    }else{
                        return idx;
                    }
                }
            }
        };
    });
})();