/**
 * Created by andrei on 23.07.2015.
 */
app.directive('button', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                element.blur();
            });
        }
    };
})
    .directive('compileTemplate', ['$compile', '$parse', function($compile, $parse){
        return {
            link: function(scope, element, attr){
                var parsed = $parse(attr.ngBindHtml);
                function getStringValue() {
                    return (parsed(scope) || '').toString();
                }

                //Recompile if the template changes
                scope.$watch(getStringValue, function() {
                    //The -9999 makes it skip directives so that we do not recompile ourselves
                    $compile(element, null, -9999)(scope);
                });
            }
        }
    }])
    .directive('scrollOnClick', function() {
        return {
            restrict: 'A',
            scope: {
                headerId: "@",
                jumpTo: "@"
            },
            link: function(scope, element, attrs) {
                var idToScroll = scope.jumpTo;
                element.on('click', function(event) {
                    event.preventDefault();
                    var $target;
                    if (idToScroll) {
                        $target = angular.element(idToScroll);
                    } else {
                        $target = element;
                    }
                    angular.element("body,html").stop().animate({'scrollTop': $target.offset().top - angular.element(scope.headerId).outerHeight() - 15});
                    return false;
                });
            }
        }
    });