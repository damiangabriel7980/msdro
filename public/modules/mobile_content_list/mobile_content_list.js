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
                categoryFunc: '=',
                dateAttr: '@'
            },
            link: function(scope, element, attrs) {
                scope.trustAsHtml = $sce.trustAsHtml;
                scope.htmlToPlainText = Utils.htmlToPlainText;

                var months = Utils.getMonthsArray();
                scope.getMonth = function (date) {
                    return months[new Date(date).getMonth()];
                };

                scope.defaultProductIcon = $rootScope.pathAmazonResources + "icons/product.png";
                scope.defaultArticleIcon = $rootScope.pathAmazonResources + "icons/article.png";
                scope.defaultMultimediaIcon = $rootScope.pathAmazonResources + "icons/film.png";
                scope.defaultDownloadIcon = $rootScope.pathAmazonResources + "icons/download.png";

                scope.calendarBg = $rootScope.pathAmazonResources + "calendar_bg.png";
            }
        };
    }]);
})();