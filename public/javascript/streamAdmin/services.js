var cloudStreamAdminServices = angular.module('cloudStreamAdminServices', ['ngResource']);
cloudStreamAdminServices.factory('AmazonService', ['$resource', function($resource){
    var getCredentialsFromServer = $resource('api/admin/s3tc', {}, {
        query: { method: 'GET', isArray: false }
    });
    return {
        getClient: function (callback) {
            getCredentialsFromServer.query().$promise.then(function (resp) {
                AWS.config.update({accessKeyId: resp.Credentials.AccessKeyId, secretAccessKey: resp.Credentials.SecretAccessKey, sessionToken: resp.Credentials.SessionToken});
                callback(new AWS.S3());
            });
        }
    }
}]);

