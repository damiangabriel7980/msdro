cloudAdminControllers.controller('SpecialGroupsMenuController', ['$scope', '$rootScope', '$stateParams', 'SpecialFeaturesService', function($scope, $rootScope, $stateParams, FeaturesMenuController){

    $scope.selectSpecialGroup = function(group){
        //TODO: change features menu
        console.log(group);
    };

}]);