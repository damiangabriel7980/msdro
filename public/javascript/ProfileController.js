/**
 * Created by andrei on 12.11.2014.
 */
cloudAdminControllers.controller('ProfileController', ['$scope', '$rootScope', '$modalInstance', 'ProfileService' ,function($scope, $rootScope, $modalInstance, ProfileService){

    var imagePre = $rootScope.pathAmazonDev;

    ProfileService.getUserData.query().$promise.then(function (resp) {
//        console.log(resp);
        $scope.userData = resp;

        $scope.image = imagePre + resp.image_path;
    });

    ProfileService.getCounties.query().$promise.then(function (resp) {
        $scope.counties = resp;
    });

    $scope.county = {};
    $scope.city = {};

    $scope.$watch('county.selected', function () {
        if($scope.county.selected!==undefined){
            ProfileService.getCities.query({county_name:$scope.county.selected.name}).$promise.then(function (resp) {
                $scope.cities = resp;
            });
            $scope.city.selected = undefined;
            $scope.cities = [];
        }
    });

    $scope.openFirst = true;

    $scope.closeModal = function(){
        $modalInstance.close();
    }
}]).filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
});