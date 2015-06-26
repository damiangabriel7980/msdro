(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('mobileContentList', []).directive('mobileContentList', ['$sce', 'Utils', function($sce, Utils) {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('mobile_content_list.js', 'mobile_content_list.html'),
            replace: true,
            scope: {
                content: '=',
                limit: '=',
                imageAttr: '@',
                imagePrefix: '@',
                defaultImage: '@',
                titleAttr: '@',
                boldTextFunction: '=',
                textAttr: '@',
                navigate: '='
            },
            link: function(scope, element, attrs) {
                scope.trustAsHtml = $sce.trustAsHtml;
                scope.htmlToPlainText = Utils.htmlToPlainText;
            }
        };
    }]);
})();