(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('horizontalContentList', []).directive('horizontalContentList', ['Utils', function(Utils) {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('directive.js', 'template.html'),
            scope: {
                contentType: '@',
                content: '=',
                imagePathAttr: '@',
                imagePathPrefix: '@',
                defaultImagePath: '@',
                titleAttr: '@',
                textAttr: '@',
                boldAttr1: '@',
                boldAttr2: '@',
                boldAttrHardcoded: '@',
                dateAttr: '@',
                buttonLabel: '@',
                showDivider: '=',
                navigate: '='
            },
            link: function(scope, element, attrs) {
                // expose functions
                scope.trustAsHtml = Utils.trustAsHtml;
                scope.createHeader = Utils.createHeader;
                scope.withBackground = attrs.hasOwnProperty("withBackground");
                scope.smallerPicture = attrs.hasOwnProperty("smallerImage");
                scope.dropShadow = attrs.hasOwnProperty("dropShadow");

                //avoid overlapping of button and excerpt
                var safetyPadding = "";
                for(var i=0; i<20; i++) safetyPadding += "&nbsp;";
                scope.safetyPadding = safetyPadding;
            }
        };
    }]);
})();