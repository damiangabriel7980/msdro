/**
 * Created by andrei on 12.11.2014.
 */
controllers.controller('Profile', ['$scope', '$rootScope', 'ProfileService', 'therapeuticAreas' , '$sce','$upload','$timeout', '$state', 'Utils', 'IntroService', function($scope, $rootScope, ProfileService, therapeuticAreas, $sce,$upload,$timeout,$state, Utils, IntroService){

    //===================================================================== init variables
    var imagePre = $rootScope.pathAmazonDev;
    $scope.showerror=false;
    $scope.showerrorProf=false;
    $scope.showerrorPass=false;

    $scope.isIpad = Utils.isMobile(false,true)['isIpad'];
    
    //=============================================================================== alert
    $scope.resetAlert = function (message, type) {
        $scope.uploadAlert = {
            newAlert: message?true:false,
            message: message,
            type: type || "danger"
        };
    };

    //================================================================================================================== PERSONAL INFO

    //------------------------------------------------------------------------------- init variables

    $scope.jobTypes = [
        {number: 1, name: "Spital"},
        {number: 2, name: "CMI"},
        {number: 3, name: "Policlinica"},
        {number: 4, name: "Farmacie"}
    ];
    $scope.goHome=function(){
        $state.go('home');
    };
    $scope.practices = [
        {
            number: 1,
            name: "Public"
        },
        {
            number: 2,
            name: "Privat"
        }
    ];

    $scope.titles = [
        {number: 1, name: "Dl"},
        {number: 2, name: "Dna"},
        {number: 3, name: "Prof"},
        {number: 4, name: "Dr"}
    ];

    //------------------------------------------------------------------------------ retrieve personal info
    ProfileService.UserData.query().$promise.then(function (resp) {
        $scope.username=resp.success.username;
        $scope.userData = resp.success;
        $scope.fullname = resp.success.name;
        $scope.phone = resp.success.phone;
        $scope.subscriptions = resp.success.subscriptions;
        $scope.imageUser = imagePre + resp.success.image_path;
        $scope.hideImg="show";
        $scope.selectedAreas = resp.success['therapeutic-areasID'] || [];
        $scope.address = resp.success.address;

        if(resp.success.job){
            $scope.job = resp.success.job[0];
            $scope.selectedJob = resp.success.job[0].job_type;
        }else{
            $scope.selectedJob = 1;
        }
        $scope.fileSelected = function($files, $event){
                //make sure a file was actually loaded
                if($files[0]){
                    var extension = $files[0].name.split('.').pop();
                    $scope.resetAlert("Fotografia se incarca...", "warning");
                    Utils.fileToBase64($files[0], function (result) {
                        ProfileService.saveUserPhoto.save({data:{Body: result, extension: extension}}).$promise.then(function (response) {
                            if(response.message){
                                $scope.resetAlert(response.message, response.success.type);
                                $scope.imageUser = "";
                                ProfileService.UserData.query().$promise.then(function (resp) {
                                    $scope.imageUser = imagePre + resp.success.image_path;
                                });
                            }
                        });
                    });
                }
        };


        //---------------------------------------------- counties / cities
        $scope.county = {
            selected: {
                name: resp.success.county_name,
                _id: resp.success.county_id
            }
        };
        $scope.city = {
            selected: {
                name: resp.success.city_name,
                _id: resp.success.city_id
            }
        };

        var cityDefault = true;

        $scope.$watch('county.selected', function () {
            if($scope.county.selected!==undefined){
                ProfileService.Cities.query({county_name:$scope.county.selected.name}).$promise.then(function (resp) {
                    $scope.cities = resp.success.sort(function(a,b){
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
    ProfileService.Counties.query().$promise.then(function (counties) {
        $scope.counties = counties.success;
    });

    //----------------------------------------------------------------------------------------------- therapeutic areas
    therapeuticAreas.areas.query().$promise.then(function (resp) {
        $scope.allAreas = resp.success;
    });

    //------------------------------------------------------------------------------------------------ form submissions

    //user profile
    $scope.userProfileAlert = {newAlert:false, type:"", message:""};
    $scope.submitProfileForm = function (isValid) {
        if(isValid){
            if(this.rememberOption){
                IntroService.hideNextTime.resetStatus();
            }
            var toSend = {};
            toSend.name = this.fullname;
            toSend.title = this.userData.title;
            toSend.phone = this.phone;
            toSend['therapeutic-areasID'] = this.newAreas;
            toSend.citiesID = [this.city.selected._id];
            toSend.address = this.address;
            toSend.subscriptions = this.userData.subscriptions;
            toSend.practiceType = this.userData.practiceType;
            ProfileService.uploadProfile.save({newData:toSend}).$promise.then(function (resp) {
                $scope.userProfileAlert.message = resp.message;
                $scope.userProfileAlert.type = "success";
                $scope.userProfileAlert.newAlert = true;
            }).catch(function(err){
                $scope.userProfileAlert.type = "danger";
                $scope.userProfileAlert.newAlert = true;
                $scope.userProfileAlert.message = err.data.error;
            });
        }
        else
        {
            $scope.userProfileAlert.newAlert = true;
            $scope.userProfileAlert.message = "Exista campuri goale/ce contin caractere invalide! Verificati formularul inca o data!";
            $scope.userProfileAlert.type = "danger";
        }
    };

    //=============================================================================================================================================== JOB
    $scope.userJobAlert = {newAlert:false, type:"", message:""};
    $scope.submitJobForm = function (isValid) {
        if(isValid){
            this.job['job_type'] = this.selectedJob;
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
        else
        {
            $scope.userJobAlert.newAlert = true;
            $scope.userJobAlert.message = "Exista campuri goale/ce contin caractere invalide! Verificati formularul inca o data!";
            $scope.userJobAlert.type = "danger";
        }
    };

    //====================================================================================================================================== CHANGE EMAIL
    $scope.userChangeMailAlert = {newAlert:false, type:"", message:""};
    $scope.submitEmailForm = function (isValid) {
        if(isValid){
            var toSend = {};
            toSend.mail = $scope.username;
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
        else
        {
            $scope.userChangeMailAlert.newAlert = true;
            $scope.userChangeMailAlert.message = "Nu ati completat toate campurile! Verificati formularul inca o data!";
            $scope.userChangeMailAlert.type = "danger";
        }
    };

    //===================================================================================================================================== CHANGE PASS
    $scope.userChangePassAlert = {newAlert:false, type:"", message:""};
    $scope.submitChangePassForm = function (isValid) {
        $scope.showerrorPass=true;
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
        else
        {
            $scope.userChangePassAlert.newAlert = true;
            $scope.userChangePassAlert.message = "Exista campuri goale! Verificati formularul inca o data!";
            $scope.userChangePassAlert.type = "danger";
        }
    };

    //---------------------------------------------------------------------------------------------------------------------- other functions / variables

    //open first accordion group by default
    $scope.openFirst = true;

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