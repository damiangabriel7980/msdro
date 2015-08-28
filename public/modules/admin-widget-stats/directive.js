(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('adminWidgetStats', []).directive('adminWidgetStats', function() {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('directive.js', 'template.html'),
            scope: {
                selectedStats: '='
            },
            link: function(scope, element, attrs) {}
        };
    });
})();