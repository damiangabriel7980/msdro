/**
 * Created by miricaandrei23 on 13.02.2015.
 */
controllers.controller('ProductPageDownloads', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce', 'Success', 'Error', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,Success,Error){
    specialProductService.SpecialProductFiles.query({id:$stateParams.product_id}).$promise.then(function(files){
        $scope.specialProductFiles = Success.getObject(files);
    }).catch(function(err){
        console.log(Error.getMessage(err));
    });
}]);