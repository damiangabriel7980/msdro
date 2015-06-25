(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('widgetMostRead', []).directive('widgetMostRead', ['Utils', function(Utils) {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('directive.js', 'template.html'),
            scope: {
                objectsArray: '=',
                widgetTitle: '@',
                titleAttr: '@',
                textAttr: '@',
                linkText: '@',
                navigate: '='
            },
            link: function(scope, element, attrs) {
                // expose functions
                scope.trustAsHtml = Utils.trustAsHtml;
                scope.createHeader = Utils.createHeader;
                scope.delimiterRight = attrs.hasOwnProperty("delimiterRight");
            }
        };
    }]);
})();