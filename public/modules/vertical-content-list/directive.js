(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('verticalContentList', []).directive('verticalContentList', ['Utils', function(Utils) {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('directive.js', 'template.html'),
            scope: {
                content: '=',
                imagePathAttr: '@',
                imagePathPrefix: '@',
                defaultImagePath: '@',
                titleAttr: '@',
                textAttr: '@',
                textAttrAlt: '=',
                navigate: '='
            },
            link: function(scope, element, attrs) {
                // expose functions
                scope.trustAsHtml = Utils.trustAsHtml;
                scope.convertAndTrustAsHtml = Utils.convertAndTrustAsHtml;
                scope.withBackground = attrs.hasOwnProperty("withBackground");
            }
        };
    }]);
})();