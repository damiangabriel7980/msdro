/**
 * Created by miricaandrei23 on 18.06.2015.
 */
(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;
    angular.module('specialDropdown', []).directive('specialDropdown', function() {
        return {
            restrict: 'EA',
            templateUrl: currentScriptPath.replace('special_dropdown.js', 'special_dropdown.html'),
            replace: true,
            scope: {
                onItemSelect: '=',
                genericObject: '=',
                amazonPath: '=',
                defaultImageUrl: '=',
                arrayOfObjects: '='
            },
            link: function(scope, element, attrs) {
                scope.callSelect = function (genericObject) {
                    scope.onItemSelect(genericObject);
                };

                scope.specialCollapsed = true;

                scope.collapseAndStyle = function(forClose){
                    if(!forClose)
                    {
                        if(!angular.element('#specialMenuId').hasClass('menuShadow')) {
                            angular.element('#specialMenuId').addClass('menuShadow');
                            scope.specialCollapsed = false;
                        }
                    }
                    else{
                        if(angular.element('#specialMenuId').hasClass('menuShadow'))
                        {
                            angular.element('#specialMenuId').removeClass('menuShadow');
                            scope.specialCollapsed = true;
                        }
                    }
                };
            }
        };
    });
})();