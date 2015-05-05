/**
 * Created by andrei on 12.11.2014.
 */
controllers.controller('ProfileMobile', ['$scope', '$rootScope', 'ProfileService', 'therapeuticAreaService' , '$sce','$upload','$timeout','$state',function($scope, $rootScope, ProfileService, therapeuticAreaService, $sce,$upload,$timeout,$state){

    var imagePre = $rootScope.pathAmazonDev;
    $scope.showerror=false;
    $scope.showerrorProf=false;
    $scope.showerrorPass=false;

    //================================================================================================================== PERSONAL INFO

    //------------------------------------------------------------------------------- init variables

    $scope.jobTypes = [
        {number: 1, name: "Spital"},
        {number: 2, name: "CMI"},
        {number: 3, name: "Policlinica"},
        {number: 4, name: "Farmacie"}
    ];
    $scope.goHomeMobile=function(){
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
    ProfileService.getUserData.query().$promise.then(function (resp) {
        $scope.username=resp.username;
        $scope.userData = resp;
        $scope.statusAlert = {newAlert:false, type:"", message:""};
        $scope.uploadAlert = {newAlert:false, type:"", message:""};
        $scope.fullname = resp.name;
        $scope.phone = resp.phone;
        $scope.subscriptions = resp.subscriptions;
        $scope.imageUser = imagePre + resp.image_path;
        $scope.hideImg="show";
        $scope.selectedAreas = resp['therapeutic-areasID'] || [];
        $scope.address = resp.address;

        if(resp.job){
            $scope.job = resp.job[0];
            $scope.selectedJob = resp.job[0].job_type;
        }else{
            $scope.selectedJob = 1;
        }
        $scope.fileSelected = function($files, $event){
            //make sure a file was actually loaded
            if($files[0]){
                var extension = $files[0].name.split('.').pop();
                var key2 = "user/"+$scope.userData._id+"/img"+$scope.userData._id+"."+extension;
                // Closure to capture the file information.
                var reader = new FileReader();
                $scope.uploadAlert.newAlert = true;
                $scope.uploadAlert.type = "success";
                $scope.uploadAlert.message = "Fotografia se incarca...";
                reader.onloadend = function(event){
                    $scope.newImage = event.target.result;
                    var b64 = $scope.newImage.split("base64,")[1];
                    $scope.imageUser="";
                    ProfileService.saveUserPhoto.save({data:{Body: b64, extension: extension}}).$promise.then(function (message) {
                        if(message){
                            $scope.uploadAlert.type = message.type;
                            $scope.uploadAlert.message = message.message;
                            $scope.uploadAlert.newAlert = true;
                            ProfileService.getUserData.query().$promise.then(function (resp) {
                                $scope.imageUser = imagePre + resp.image_path;
                                $timeout(function() {
                                    $scope.$apply($scope);
                                },100);
                            });


                        }
                    });
                };

                reader.readAsDataURL($files[0]);

                // Read in the image file as a data URL.




            }

        };


        //---------------------------------------------- counties / cities
        $scope.county = {
            selected: {
                name: resp.county_name,
                _id: resp.county_id
            }
        };
        $scope.city = {
            selected: {
                name: resp.city_name,
                _id: resp.city_id
            }
        };

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
    therapeuticAreaService.query().$promise.then(function (resp) {
        $scope.allAreas = resp;
    });

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
            if(this.rememberOption==true)
                localStorage.removeItem('statusModalGroups');
            var toSend = {};
            toSend.name = this.fullname;
            toSend.title = this.userData.title;
            console.log("====================");
            console.log(toSend.title);
            toSend.phone = this.phone;
            toSend['therapeutic-areasID'] = this.newAreas;
            toSend.citiesID = [this.city.selected._id];
            toSend.address = this.address;
            toSend.subscriptions = this.userData.subscriptions;
            toSend.practiceType = this.userData.practiceType;
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

    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.convertAndTrustAsHtml=function (data) {
        var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        return $sce.trustAsHtml(convertedText);
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