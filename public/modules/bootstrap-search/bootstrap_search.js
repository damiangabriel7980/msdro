(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;
    angular.module('bootstrapSearch', []).directive('bootstrapSearch', function() {
        return {
            restrict: 'EA',
            templateUrl: currentScriptPath.replace('bootstrap_search.js', 'bootstrap_search.html'),
            replace: true,
            scope: {
                animatedInput: '=',
                onSearch: '=',
                defaultStyle: '='
            },
            link: function(scope, element, attrs) {
                scope.callSearch = function (term) {
                    scope.onSearch(term);
                };
                scope.animateInput=function(){
                    angular.element('.popSearch').toggleClass('newWidthPopSearch');
                    angular.element('.input-group-addon').toggleClass('btnSearchBefore');
                };
            }
        };
    });
})();