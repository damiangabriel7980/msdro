/**
 * Created by andrei on 12.11.2014.
 */
app.controllerProvider.register('Profile', ['$scope', '$rootScope', 'ProfileService', 'therapeuticAreas' , '$sce', '$timeout', '$state', 'Utils', 'IntroService', 'Success', 'Error', 'Validations', 'SpecialFeaturesService', function($scope, $rootScope, ProfileService, therapeuticAreas, $sce, $timeout,$state, Utils, IntroService, Success, Error, Validations, SpecialFeaturesService){

    //===================================================================== init variables
    var imagePre = $rootScope.pathAmazonDev;
    $scope.showerror=false;
    $scope.showerrorProf=false;
    $scope.showerrorPass=false;

    $scope.isMobileDevice = Utils.isMobile(false,true)['isIOSDevice'] || Utils.isMobile(false,true)['isAndroidDevice'];
    
    //=============================================================================== alert
    $scope.resetAlert = function (message, type) {
        $scope.uploadAlert = {
            newAlert: message?true:false,
            message: message,
            type: type || "danger"
        };
    };

    Validations.regexp.query().$promise.then(function(resp){
       $scope.validationsObject = Success.getObject(resp);
        $scope.nameValidator = new RegExp($scope.validationsObject.name.str);
            $scope.phoneValidator = new RegExp($scope.validationsObject.phone.str);
            $scope.jobNameValidator = new RegExp($scope.validationsObject.jobName.str);
            $scope.jobNumberValidator = new RegExp($scope.validationsObject.jobNumber.str);
            $scope.authorAndTitleValidator = new RegExp($scope.validationsObject.authorAndTitle.str);
            $scope.streetNameValidator = new RegExp($scope.validationsObject.streetName.str,'i');
            $scope.nicknameValidator = new RegExp($scope.validationsObject.nickname.str,'i');
    });

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
    ProfileService.UserData.query({cache: new Date()}).$promise.then(function (resp) {
        var userData = Success.getObject(resp);
        $scope.username = userData.username;
        $scope.userData = userData;
        $scope.fullname = userData.name;
        $scope.phone = userData.phone;
        $scope.subscriptions = userData.subscriptions;
        $scope.imageUser = imagePre + userData.image_path;
        $scope.selectedAreas = userData['therapeutic-areasID'] || [];
        $scope.address = userData.address;
        $scope.selectedCounty = {
            name: userData.county_name,
            _id: userData.county_id
        };
        $scope.selectedCity = {
            name: userData.city_name,
            _id: userData.city_id
        };

        if(userData.job){
            $scope.job = userData.job;
            $scope.selectedJob = userData.job.job_type;
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
                                $scope.resetAlert(Success.getMessage(response), "success");
                                $scope.imageUser = "";
                                ProfileService.UserData.query().$promise.then(function (resp) {
                                    $scope.imageUser = imagePre + Success.getObject(resp).image_path;
                                });
                        }).catch(function(err){
                            $scope.resetAlert(Error.getMessage(err), "danger");
                        });
                    });
                }
        };
    });

    // get counties and cities
    ProfileService.Counties.query().$promise.then(function (counties) {
        $scope.counties = Success.getObject(counties);
    });

    $scope.countyWasSelected = function (county) {
        ProfileService.Cities.query({county_name: county.name}).$promise.then(function (resp) {
            $scope.cities = Success.getObject(resp).sort(function(a,b){
                if ( a.name < b.name )
                    return -1;
                if ( a.name > b.name )
                    return 1;
                return 0;
            });
        });
    }

    //----------------------------------------------------------------------------------------------- therapeutic areas
    therapeuticAreas.areas.query().$promise.then(function (resp) {
        $scope.allAreas = Success.getObject(resp);
    });

    //------------------------------------------------------------------------------------------------ form submissions

    //user profile
    var resetProfileAlert = function (text, type) {
        $scope.userProfileAlert = {
            text: text,
            type: type || "danger"
        };
    };
    $scope.submitProfileForm = function (isValid) {
        if(!this.selectedCounty || !this.selectedCounty._id){
            resetProfileAlert("Va rugam selectati un judet");
        }else if(!this.selectedCity || !this.selectedCity._id){
            resetProfileAlert("Va rugam selectati un oras");
        }else if(isValid){
            if(this.rememberOption){
                SpecialFeaturesService.specialGroups.getSelected().then(function (group) {
                    IntroService.hideNextTime.setStatus(group._id, false);
                });
            }
            var toSend = {};
            toSend.name = this.fullname;
            toSend.title = this.userData.title;
            toSend.phone = this.phone;
            toSend['therapeutic-areasID'] = this.newAreas;
            toSend.citiesID = [this.selectedCity._id];
            toSend.address = this.address;
            toSend.subscriptions = this.userData.subscriptions;
            toSend.practiceType = this.userData.practiceType;
            ProfileService.UserData.save({newData:toSend}).$promise.then(function (resp) {
                resetProfileAlert(Success.getMessage(resp), "success");
            }).catch(function(err){
                resetProfileAlert(Error.getMessage(err));
            });
        }else{
            resetProfileAlert("Exista campuri goale/ce contin caractere invalide! Verificati formularul inca o data!");
        }
    };

    //=============================================================================================================================================== JOB
    $scope.userJobAlert = {newAlert:false, type:"", message:""};
    $scope.submitJobForm = function (isValid) {
        if(isValid){
            this.job['job_type'] = this.selectedJob;
            ProfileService.uploadJob.save({job: this.job}).$promise.then(function (resp) {
                $scope.userJobAlert.message = Success.getMessage(resp);
                 $scope.userJobAlert.type = "success";
                $scope.userJobAlert.newAlert = true;
            }).catch(function(errJob){
                $scope.userJobAlert.type = "danger";
                $scope.userJobAlert.newAlert = true;
                $scope.userJobAlert.message = Error.getMessage(errJob);
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
                $scope.userChangeMailAlert.message = Success.getMessage(resp);
                $scope.userChangeMailAlert.type = "success";
                $scope.userChangeMailAlert.newAlert = true;
            }).catch(function(errEmail){
                $scope.userChangeMailAlert.type = "danger";
                $scope.userChangeMailAlert.newAlert = true;
                $scope.userChangeMailAlert.message = Error.getMessage(errEmail);
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
                $scope.userChangePassAlert.message = Success.getMessage(resp);
                $scope.userChangePassAlert.type = "success";
                $scope.userChangePassAlert.newAlert = true;
            }).catch(function(errPass){
                $scope.userChangePassAlert.type = "danger";
                $scope.userChangePassAlert.newAlert = true;
                $scope.userChangePassAlert.message = Error.getMessage(errPass);
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

}]);