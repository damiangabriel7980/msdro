controllers.controller('JanuviaUserEdit', ['$scope', '$state', 'idToEdit', 'userTypes', 'JanuviaService', 'LocationService', 'Success', '$modalInstance', '$q', function ($scope, $state, idToEdit, userTypes, JanuviaService, LocationService, Success, $modalInstance, $q) {

    //===================================== init vars
    $scope.user = {
        type: "medic" //this fixes a weird bug where the last option in the userTypes array is not selected
    };

    $scope.county = {
        selected: null
    };

    $scope.city = {
        selected: null
    };

    $scope.userTypes = userTypes;

    //===================================== get all the data from server
    JanuviaService.users.query({id: idToEdit}).$promise.then(function (resp) {
        var user = Success.getObject(resp);
        $scope.user = user;
        $scope.selectedMedics = user.users_associated;
        var city = user.city;
        if(city){
            getCounty(city._id).then(function () {
                $scope.city = {
                    selected: {
                        name: city.name,
                        _id: city._id
                    }
                };
                watchCounties();
            });
        }else{
            watchCounties();
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
        var city = $scope.city;
        if(city && city.selected && city.selected._id) user.city = city.selected._id;
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
    function watchCounties() {
        $scope.$watch('county.selected', function (newVal, oldVal) {
            if(newVal){
                getCities(newVal._id, oldVal && oldVal._id !== newVal._id);
            }
        });
    }

    function getCities(county_id, resetSelected) {
        var deferred = $q.defer();
        LocationService.cities.query({county: county_id}).$promise.then(function (resp) {
            if(resetSelected) $scope.city = {};
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
            var county = Success.getObject(resp);
            $scope.county = {
                selected: {
                    name: county.name,
                    _id: county._id
                }
            };
            deferred.resolve();
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

}]).filter('propsFilter', function() {
    //used for select2
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