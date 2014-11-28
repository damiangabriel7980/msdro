/**
 * Created by andrei on 12.11.2014.
 */
cloudAdminControllers.controller('ProfileController', ['$scope', '$rootScope', '$modalInstance', 'ProfileService', 'therapeuticAreaService' , '$sce',function($scope, $rootScope, $modalInstance, ProfileService, therapeuticAreaService, $sce){

    var imagePre = $rootScope.pathAmazonDev;

    //----------------------------------------------------------------------------------------------- user profile data

    $scope.county = {};
    $scope.city = {};
    $scope.jobTypes = ["Spital","CMI","Policlinica","Farmacie"];

    ProfileService.getUserData.query().$promise.then(function (resp) {

        $scope.userData = resp;
        console.log(resp);

        var allNames = resp.name.split(" ");
        $scope.firstName = allNames[0];
        allNames.splice(0,1);
        $scope.lastName = allNames.join(" ");
        $scope.phone = resp.phone;
        $scope.newsletter = resp.subscription == 1;
        $scope.image = imagePre + resp.image_path;
        $scope.userTherapeuticAreas = resp['therapeutic-areasID']?resp['therapeutic-areasID']:[];
        if(resp.job){
            $scope.job = resp.job[0];
        }else{
            $scope.job = {
                _id: 0,
                job_type: "",
                job_name: "",
                street_name: "",
                street_number: "",
                postal_code: "",
                job_address: ""
            };
        }

        //select user's county and city

        $scope.county['selected'] = {};
        $scope.county['selected']['name'] = resp.county_name;
        $scope.county['selected']['_id'] = resp.county_id;
        $scope.city['selected'] = {};
        $scope.city['selected']['name'] = resp.city_name;
        $scope.city['selected']['_id'] = resp.city_id;

        var cityDefault = true;

        $scope.$watch('county.selected', function () {
            if($scope.county.selected!==undefined){
                ProfileService.getCities.query({county_name:$scope.county.selected.name}).$promise.then(function (resp) {
                    $scope.cities = resp.sort(function(a,b){
                        if ( a.name < b.name )
                            return -1;
                        if ( a.name > b.name )
                            return 1;
                        return 0;
                    });
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

    //get all
    therapeuticAreaService.query().$promise.then(function (resp) {
        var areasOrganised = [];
        areasOrganised.push({id:0, name:"Adauga arii terapeutice"});
        areasOrganised.push({id:1, name:"Toate"});
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
                            areasOrganised.push({id: resp[j]._id, name:"0"+resp[j].name});
                        }
                    }
                }
            }
        }
        $scope.allAreas = areasOrganised;
        $scope.selectedArea = $scope.allAreas[0];

    });

    var findInUserAreas = function (id) {
        var index = -1;
        var i=0;
        var found = false;
        while(!found && i<$scope.userTherapeuticAreas.length){
            if($scope.userTherapeuticAreas[i].id==id){
                found = true;
                index = i;
            }
            i++;
        }
        return index;
    };

    $scope.areaWasSelected = function (sel) {
        if(sel.id!=0){
            if(sel.id==1){
                $scope.userTherapeuticAreas = [];
                for(var i=2; i<$scope.allAreas.length; i++){
                    $scope.userTherapeuticAreas.push($scope.allAreas[i]);
                }
            }else{
                var index = findInUserAreas(sel.id);
                if(index==-1) $scope.userTherapeuticAreas.push(sel);
            }
        }
    };

    $scope.removeUserArea = function (id) {
        var index = findInUserAreas(id);
        if(index>-1){
            $scope.userTherapeuticAreas.splice(index,1);
        }
    };

    //----------------------------------------------------------------------------------------------------- User points
    $scope.pointsTotal = 0;
    $scope.pointsSlide = 0;
    $scope.pointsVideo = 0;
    $scope.pointsArticles = 0;

    //------------------------------------------------------------------------------------------------ form submissions

    //user profile
    $scope.userProfileAlert = {newAlert:false, type:"", message:""};
    $scope.submitProfileForm = function (isValid) {
        if(isValid){
            var toSend = {};
            toSend.firstName = this.firstName;
            toSend.lastName = this.lastName;
            toSend.phone = this.phone;
            toSend.newsletter = this.newsletter;
            console.log($scope.userTherapeuticAreas);
            toSend.therapeuticAreas = $scope.userTherapeuticAreas;
            toSend.county = this.county.selected._id;
            toSend.city = this.city.selected._id;
            ProfileService.uploadProfile.save({newData:toSend}).$promise.then(function (resp) {
                $scope.userProfileAlert.message = resp.message;
                if(resp.error){
                    $scope.userProfileAlert.type = "danger";
                }else{
                    $scope.userProfileAlert.type = "success";
                }
                $scope.userProfileAlert.newAlert = true;
            });
        }
    };

    //user job
    $scope.userJobAlert = {newAlert:false, type:"", message:""};
    $scope.submitJobForm = function (isValid) {
        if(isValid){
            switch(this.selectedJob){
                case("Spital"): this.job['job_type']=1; break;
                case("CMI"): this.job['job_type']=2; break;
                case("Policlinica"): this.job['job_type']=3; break;
                case("Farmacie"): this.job['job_type']=4; break;
                default: this.job['job_type']=null; break;
            }
            ProfileService.uploadJob.save({job: this.job}).$promise.then(function (resp) {
                $scope.userJobAlert.message = resp.message;
                if(resp.error){
                    $scope.userJobAlert.type = "danger";
                }else{
                    $scope.userJobAlert.type = "success";
                }
                $scope.userJobAlert.newAlert = true;
            });
        }
    };

    //user change email
    $scope.userChangeMailAlert = {newAlert:false, type:"", message:""};
    $scope.submitEmailForm = function (isValid) {
        if(isValid){
            var toSend = {};
            toSend.mail = this.changeMail;
            toSend.pass = this.changePass;
            ProfileService.changeEmail.save({userData: toSend}).$promise.then(function (resp) {
                $scope.userChangeMailAlert.message = resp.message;
                if(resp.error){
                    $scope.userChangeMailAlert.type = "danger";
                }else{
                    $scope.userChangeMailAlert.type = "success";
                }
                $scope.userChangeMailAlert.newAlert = true;
            });
        }
    };

    //user change pass
    $scope.userChangePassAlert = {newAlert:false, type:"", message:""};
    $scope.submitChangePassForm = function (isValid) {
        if(isValid){
            var toSend = {};
            toSend.oldPass = this.oldPass;
            toSend.newPass = this.newPass;
            toSend.confirmPass = this.confirmPass;
            ProfileService.changePassword.save({userData: toSend}).$promise.then(function (resp) {
                $scope.userChangePassAlert.message = resp.message;
                if(resp.error){
                    $scope.userChangePassAlert.type = "danger";
                }else{
                    $scope.userChangePassAlert.type = "success";
                }
                $scope.userChangePassAlert.newAlert = true;
            });
        }
    };

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