/**
 * Created by andreimirica on 10.11.2015.
 */
/**
 * Created by andrei on 03.12.2014.
 */
//similar use as ng-src. Forces server to request image, instead of loading it from cache
streamAdminApp.directive('noCacheSrc', ['$window', function($window) {
    return {
        priority: 99,
        link: function(scope, element, attrs) {
            attrs.$observe('noCacheSrc', function(noCacheSrc) {
                noCacheSrc += '?' + (new Date()).getTime();
                attrs.$set('src', noCacheSrc);
            });
        }
    }
}]);