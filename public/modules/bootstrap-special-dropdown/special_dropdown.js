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
                dropdownClass: '@',
                itemClass: '@',
                onItemSelect: '=',
                genericObject: '=',
                amazonPath: '=',
                defaultImageUrl: '=',
                arrayOfObjects: '=',
                defaultStyles: '='
            },
            link: function(scope, element, attrs) {
                scope.callSelect = function (genericObject) {
                    scope.onItemSelect(genericObject);
                };
                scope.$watch('genericObject', function () {
                    initObject();
                });
                scope.$watch('arrayOfObjects', function () {
                    initArrayOfObjects();
                });
                scope.specialCollapsed = true;

                var initObject = function(){
                    var currentObject = {};
                    if(scope.genericObject){
                        currentObject = scope.genericObject;
                    }
                    scope.currentObject = currentObject;
                };

                var initArrayOfObjects = function(){
                    if(scope.arrayOfObjects){
                        var allGroups = [];
                        for(var i=0; i< scope.arrayOfObjects.length; i++)
                            allGroups.push(scope.arrayOfObjects[i]);
                    }
                    scope.allGroups = allGroups;
                };

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