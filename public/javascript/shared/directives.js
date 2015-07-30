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
});