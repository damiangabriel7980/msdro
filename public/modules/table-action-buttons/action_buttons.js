(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('actionButtons', []).directive('actionButtons', function() {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('action_buttons.js', 'action_buttons.html'),
            replace: true,
            scope: {
                showToggleButton: '=',
                itemEnableProperty: '=',
                toggleItem: '&',
                deleteItem: '&',
                updateItem: '&',
                showEditButton: '=',
                showDeleteButton: '='
            },
            link: function(scope, element, attrs) {

            }
        };
    });
})();