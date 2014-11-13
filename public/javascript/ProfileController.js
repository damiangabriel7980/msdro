/**
 * Created by andrei on 12.11.2014.
 */
cloudAdminControllers.controller('ProfileController', ['$scope', '$rootScope', '$modalInstance', 'ProfileService', 'therapeuticAreaService' ,function($scope, $rootScope, $modalInstance, ProfileService, therapeuticAreaService){

    var imagePre = $rootScope.pathAmazonDev;

    //----------------------------------------------------------------------------------------------- user profile data

    $scope.county = {};
    $scope.city = {};

    ProfileService.getUserData.query().$promise.then(function (resp) {

        $scope.userData = resp;
        console.log(resp);

        var allNames = resp.name.split(" ");
        $scope.firstName = allNames[0];
        $scope.lastName = allNames[1];
        $scope.phone = resp.phone;
        $scope.newsletter = resp.subscription == 1 ? "true":"false";
        $scope.image = imagePre + resp.image_path;
        $scope.areasIn = resp['therapeutic-areasID'];

        //select user's county and city

        $scope.county['selected'] = {};
        $scope.county['selected']['name'] = resp.county_name;
        $scope.county['selected']['id'] = resp.county_id;
        $scope.city['selected'] = {};
        $scope.city['selected']['name'] = resp.city_name;
        $scope.city['selected']['id'] = resp.city_id;

        var cityDefault = true;

        $scope.$watch('county.selected', function () {
            if($scope.county.selected!==undefined){
                ProfileService.getCities.query({county_name:$scope.county.selected.name}).$promise.then(function (resp) {
                    $scope.cities = resp;
                });
                if(!cityDefault) $scope.city.selected = undefined;
                cityDefault = false;
                $scope.cities = [];
            }
        });

    });

    // get counties and cities
    ProfileService.getCounties.query().$promise.then(function (counties) {
        $scope.counties = counties;
    });

    //----------------------------------------------------------------------------------------------- therapeutic areas

    therapeuticAreaService.query().$promise.then(function (resp) {
        var areasOrganised = [];
        for(var i=0; i<resp.length; i++){
            var thisArea = resp[i];
            if(thisArea['therapeutic-areasID'].length == 0){
                //it's a parent. Add it
                areasOrganised.push({id: thisArea._id, name:thisArea.name});
                if(thisArea.has_children){
                    //find all it's children
                    for(var j=0; j < resp.length; j++){
                        if(resp[j]['therapeutic-areasID'].indexOf(thisArea._id)>-1){
                            //found one children. Add it
                            areasOrganised.push({id: resp[j]._id, name:"&nbsp;&nbsp;&nbsp;&nbsp;"+resp[j].name});
                        }
                    }
                }
            }
        }
        $scope.allAreas = areasOrganised;
    });

    //----------------------------------------------------------------------------------------------------- User points
    $scope.pointsTotal = 0;
    $scope.pointsSlide = 0;
    $scope.pointsVideo = 0;
    $scope.pointsArticles = 0;

    //------------------------------------------------------------------------------------- other functions / variables

    //open first accordion group by default
    $scope.openFirst = true;

    $scope.closeModal = function(){
        $modalInstance.close();
    }
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