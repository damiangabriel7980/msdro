/**
 * Created by andrei on 12.11.2014.
 */
cloudAdminControllers.controller('ProfileController', ['$scope', '$rootScope', '$modalInstance', 'ProfileService', 'therapeuticAreaService' , '$sce','$upload','$timeout',function($scope, $rootScope, $modalInstance, ProfileService, therapeuticAreaService, $sce,$upload,$timeout){

    var imagePre = $rootScope.pathAmazonDev;

    //----------------------------------------------------------------------------------------------- user profile data

    $scope.county = {};
    $scope.city = {};
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.convertAndTrustAsHtml=function (data) {
        var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        return $sce.trustAsHtml(convertedText);
    };
    $scope.showerror=false;
    $scope.showerrorProf=false;
    $scope.showerrorPass=false;
    $scope.jobTypes = ["Spital","CMI","Policlinica","Farmacie"];
    $scope.selectedJob="";
    ProfileService.getUserData.query().$promise.then(function (resp) {
        $scope.username=resp.username;
        $scope.userData = resp;
        $scope.statusAlert = {newAlert:false, type:"", message:""};
        $scope.uploadAlert = {newAlert:false, type:"", message:""};
        var allNames = resp.name.split(" ");
        $scope.firstName = allNames[0];
        allNames.splice(0,1);
        $scope.lastName = allNames.join(" ");
        $scope.phone = resp.phone;
        $scope.newsletter = resp.subscription == 1;
        $scope.imageUser = imagePre + resp.image_path;
        $scope.hideImg="show";
        $scope.userTherapeuticAreas = resp['therapeutic-areasID']?resp['therapeutic-areasID']:[];
        if($scope.userTherapeuticAreas.length!=0) {
            for (var i = 0; i < $scope.allAreas.length; i++) {
                for (var j=0;j<$scope.userTherapeuticAreas.length;j++){
                    if($scope.allAreas[i].id===$scope.userTherapeuticAreas[j])
                    {
                        $scope.userTherapeuticAreas[j] = $scope.allAreas[i];
                        continue;
                    }

                }

            }
            console.log($scope.userTherapeuticAreas);
        }
        if(resp.job){
            $scope.job = resp.job[0];
            switch($scope.job.job_type){
                case 1: $scope.selectedJob="Spital"; break;
                case 2: $scope.selectedJob="CMI"; break;
                case 3: $scope.selectedJob="Policlinica"; break;
                case 4: $scope.selectedJob="Farmacie"; break;
                default: $scope.selectedJob=null; break;
            }
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
    $scope.allAreas=[];
    //get all
    var therap=[];
    therapeuticAreaService.query().$promise.then(function (resp) {
        var areasOrganised = [];
        therap=resp;
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
        if($scope.userTherapeuticAreas!=undefined) {
            for (var i = 0; i < $scope.allAreas.length; i++) {
                for (var j=0;j<$scope.userTherapeuticAreas.length;j++){
                    if($scope.allAreas[i].id===$scope.userTherapeuticAreas[j])
                    {
                        $scope.userTherapeuticAreas[j] = $scope.allAreas[i];
                        continue;
                    }

                }

            }
            console.log($scope.userTherapeuticAreas);
        }
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
        $scope.showerrorProf=true;
        if(isValid){
            var toSend = {};
            toSend.firstName = this.firstName;
            toSend.lastName = this.lastName;
            toSend.phone = this.phone;
            toSend.newsletter = this.newsletter;
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
        else
        {
            $scope.userProfileAlert.newAlert = true;
            $scope.userProfileAlert.message = "Nu ati completat toate campurile! Verificati formularul inca o data!";
            $scope.userProfileAlert.type = "danger";
        }
    };

    //user job
    $scope.userJobAlert = {newAlert:false, type:"", message:""};
    $scope.submitJobForm = function (isValid) {
        $scope.showerror=true;
        console.log(isValid);
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
        else
        {
            $scope.userJobAlert.newAlert = true;
            $scope.userJobAlert.message = "Nu ati completat toate campurile! Verificati formularul inca o data!";
            $scope.userJobAlert.type = "danger";
        }
    };

    //user change email
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

    //user change pass
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
            $scope.userChangePassAlert.message = "Nu ati completat toate campurile! Verificati formularul inca o data!";
            $scope.userChangePassAlert.type = "danger";
        }
    };

    //------------------------------------------------------------------------------------- other functions / variables

    //open first accordion group by default
    $scope.openFirst = true;

    $scope.closeModal = function(){
        var $body = angular.element(document.body);
        $body.css("overflow", "auto");
        $body.width("100%");
        angular.element('.navbar').width("50%");
        angular.element('#footer').width("100%");
        $modalInstance.close();
    };

    $scope.trustAsHtml = function (val) {
        return $sce.trustAsHtml(val);
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