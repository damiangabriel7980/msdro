/**
 * Created by andrei on 03.12.2014.
 */
//similar use as ng-src. Forces server to request image, instead of loading it from cache
cloudAdminApp.directive('noCacheSrc', function($window) {
    return {
        priority: 99,
        link: function(scope, element, attrs) {
            attrs.$observe('noCacheSrc', function(noCacheSrc) {
                noCacheSrc += '#' + (new Date()).getTime();
                attrs.$set('src', noCacheSrc);
            });
        }
    }
});