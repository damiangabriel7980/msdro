cloudAdminControllers.controller('FeaturesController', ['$scope', '$rootScope', '$stateParams', '$sce',function($scope, $rootScope, $stateParams, $sce){
    $scope.featureSrc = "";
    switch ($stateParams.feature){
        case "arcoxiaApp": $scope.featureSrc = $sce.trustAsResourceUrl("http://msd-ionic.herokuapp.com/");
    }
}]);