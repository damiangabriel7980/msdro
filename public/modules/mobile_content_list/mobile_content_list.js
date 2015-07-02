(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('mobileContentList', []).directive('mobileContentList', ['$sce', 'Utils', '$rootScope', function($sce, Utils, $rootScope) {
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
                navigate: '=',
                category: '@',
                dateAttr: '@'
            },
            link: function(scope, element, attrs) {
                scope.trustAsHtml = $sce.trustAsHtml;
                scope.htmlToPlainText = Utils.htmlToPlainText;

                scope.defaultProductIcon = $rootScope.defaultProductIcon;
                scope.defaultArticleIcon = $rootScope.defaultArticleIcon;
                scope.defaultMultimediaIcon = $rootScope.defaultMultimediaIcon;

                scope.calendarBg = $rootScope.pathAmazonResources + "calendar_bg.png";
            }
        };
    }]);
})();