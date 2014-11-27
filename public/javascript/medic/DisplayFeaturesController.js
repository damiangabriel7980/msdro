cloudAdminControllers.controller('DisplayFeaturesController', ['$scope', '$rootScope', '$stateParams', '$sce', 'SpecialFeaturesService', function($scope, $rootScope, $stateParams, $sce, SpecialFeaturesService){
    $scope.featureSrc = "";
    switch ($stateParams.feature){
        case "arcoxiaApp": $scope.featureSrc = $sce.trustAsResourceUrl("http://msd-ionic.herokuapp.com/");
    }
}]);