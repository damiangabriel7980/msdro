(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('mobileContentList', []).directive('mobileContentList', ['$sce', '$state', function($sce, $state) {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('mobile_content_list.js', 'mobile_content_list.html'),
            replace: true,
            scope: {
                content: '=',
                limit: '=',
                imagePrefix: '=',
                defaultImage: '=',
                sref: '='
            },
            link: function(scope, element, attrs) {
                scope.trustAsHtml = $sce.trustAsHtml;
                scope.navigateTo = function (content_id) {
                    $state.go(scope.sref, {id: content_id});
                }
            }
        };
    }]);
})();