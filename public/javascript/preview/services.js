/**
 * Created by andrei.mirica on 24/08/16.
 */
var services = angular.module('services', ['ngResource']);
services.factory('PreviewService', ['$resource', function($resource){
    return {
        retrieveContent: $resource('apiPreview/previewItem', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);
