cloudAdminControllers.controller('DisplayFeaturesController', ['$scope', '$rootScope', '$stateParams', '$sce', 'SpecialFeaturesService', function($scope, $rootScope, $stateParams, $sce, SpecialFeaturesService){
    $scope.featureSrc = "";
    switch ($stateParams.feature){
        case "Januvia": $scope.featureSrc = $sce.trustAsResourceUrl("https://msd-ionic.herokuapp.com/"); break;
    }
}]);