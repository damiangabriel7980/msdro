controllers.controller('JanuviaUserEdit', ['$scope', '$state', 'idToEdit', 'userTypes', 'JanuviaService', 'LocationService', 'Success', '$modalInstance', '$q', function ($scope, $state, idToEdit, userTypes, JanuviaService, LocationService, Success, $modalInstance, $q) {

    //===================================== init vars
    $scope.user = {
        type: "medic" //this fixes a weird bug where the last option in the userTypes array is not selected
    };

    $scope.userTypes = userTypes;

    //===================================== get all the data from server
    JanuviaService.users.query({id: idToEdit}).$promise.then(function (resp) {
        var user = Success.getObject(resp);
        $scope.user = user;
        $scope.selectedMedics = user.users_associated;
        var city = user.city;
        if(city){
            $scope.selectedCity = {
                name: city.name,
                _id: city._id
            };
            getCounty(city._id).then(function (county) {
                getCities(county._id);
                $scope.selectedCounty = {
                    name: county.name,
                    _id: county._id
                };
            });
        }else{
            $scope.selectedCity = {};
            $scope.selectedCounty = {};
        }
    });

    JanuviaService.users.query({type: "medic"}).$promise.then(function (resp) {
        $scope.medics = Success.getObject(resp);
    });

    LocationService.counties.query().$promise.then(function (resp) {
        $scope.counties = Success.getObject(resp);
    });

    //================================================= functions

    //form submission
    $scope.save = function () {
        var user = $scope.user;
        var city = $scope.selectedCity;
        if(city && city._id) user.city = city._id;
        if(user.type === "reprezentant"){
            user.users_associated = $scope.selectedMedicsIds;
        }else{
            user.users_associated = [];
        }
        JanuviaService.users.update({id: user._id}, user).$promise.then(function () {
            $state.reload();
            $modalInstance.close();
        });
    };

    //watch county change
    $scope.countyWasSelected = function (county) {
        if(county && county._id){
            getCities(county._id);
        }else{
            $scope.cities = [$scope.selectedCity];
        }

    };

    function getCities(county_id) {
        var deferred = $q.defer();
        LocationService.cities.query({county: county_id}).$promise.then(function (resp) {
            $scope.cities = Success.getObject(resp).sort(function(a,b){
                if ( a.name < b.name )
                    return -1;
                if ( a.name > b.name )
                    return 1;
                return 0;
            });
            deferred.resolve();
        });
    }

    function getCounty(city_id) {
        var deferred = $q.defer();
        LocationService.counties.query({city: city_id}).$promise.then(function (resp) {
            deferred.resolve(Success.getObject(resp));
        });
        return deferred.promise;
    }

    $scope.resetAlert = function (text, type) {
        $scope.alert = {
            text: text,
            type: type || "danger"
        };
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    };

}]);