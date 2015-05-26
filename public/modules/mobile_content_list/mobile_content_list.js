(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('mobileContentList', []).directive('mobileContentList', ['$sce', '$state', 'PublicService', function($sce, $state, PublicService) {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('mobile_content_list.js', 'mobile_content_list.html'),
            replace: true,
            scope: {
                content: '=',
                limit: '=',
                imagePrefix: '=',
                defaultImage: '='
            },
            link: function(scope, element, attrs) {
                scope.trustAsHtml = $sce.trustAsHtml;
                scope.navigateTo = function (content) {
                    $state.go(PublicService.getSref(content.type), {id: content._id});
                }
            }
        };
    }]);
})();