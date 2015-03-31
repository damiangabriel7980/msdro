app.controller('CompleteProfile', ['$scope', 'CompleteProfileService', '$window', 'Utils', function($scope, CompleteProfileService, $window, Utils) {

    //================================================================================================== init variables
    $scope.user = {
        subscriptions: {
            newsletterStaywell: false,
            infoMSD: false
        }
    };

    var lockSubmitting = false;

    $scope.codeTooltip = "Deoarece statul roman, prin legea 95/2006 cu HCS nr 27_11.10.2013 " +
        "reglementeaza publicitatea medicamentelor doar catre specialisti in domeniul sanatatii, " +
        "va rugam sa introduceti codul care atesta dovada calitatii dvs de profesionist in domeniul " +
        "sanatatii (medic/farmacist). Daca nu aveti un cod de activare, va rugam sa contactati " +
        "un reprezentant MSD sau sa sunati la numarul de telefon ...";

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

    $scope.proofFile = null;

    //============================================================================================== profession / group

    $scope.selectProfession = function () {
        CompleteProfileService.specialGroups.query({profession: $scope.user.profession}).$promise.then(function (response) {
            $scope.groups = response;
            $scope.user.groupsID = response[0]._id;
            lockSubmitting = false;
        });
    };

    CompleteProfileService.professions.query().$promise.then(function (response) {
        lockSubmitting = true;
        $scope.professions = response;
        $scope.user.profession = response[0]._id;
        $scope.selectProfession();
    });

    //=================================================================================================== county / city

    var resetCities = function () {
        $scope.cities = [];
        $scope.city = {
            selected: {}
        };
    };
    var resetCounties = function () {
        $scope.counties = [];
        $scope.county = {
            selected: {}
        };
    };
    resetCities();
    resetCounties();

    $scope.$watch('county.selected', function () {
        if($scope.county.selected){
            resetCities();
            CompleteProfileService.cities.query({county: $scope.county.selected._id}).$promise.then(function (resp) {
                if(resp.success){
                    $scope.cities = resp.success.sort(function(a,b){
                        if ( a.name < b.name )
                            return -1;
                        if ( a.name > b.name )
                            return 1;
                        return 0;
                    });
                }
            });
        }
    });

    // get counties and cities
    CompleteProfileService.counties.query().$promise.then(function (resp) {
        $scope.counties = resp.success;
    });

    //====================================================================================================== load proof

    $scope.proofSelected = function ($files, $event) {
        if(($files||[])[0]){
            $scope.proofFile = $files[0];
        }
    };

    //========================================================================================================== submit

    $scope.sendActivationForm = function () {
        if(!lockSubmitting){
            var activationCode = this.activationCode;
            var user = JSON.parse(JSON.stringify(this.user));
            var county = this.county.selected._id;
            var city = this.city.selected._id;
            //format data according to database model
            user.citiesID = [city];
            user.groupsID = [user.groupsID];

            if(!user.profession){
                $scope.resetAlert("danger", "Va rugam selectati o profesie");
            }else if(!(this.proofType === 'code' || this.proofType === 'file')){
                $scope.resetAlert("danger", "Trebuie sa incarcati o dovada sau sa introduceti un cod");
            }else if(this.proofType == "code" && !activationCode){
                $scope.resetAlert("danger", "Va rugam introduceti codul de activare");
            }else if(this.proofType == "file" && !$scope.proofFile){
                $scope.resetAlert("danger", "Va rugam incarcati dovada");
            }else if(!user.groupsID){
                $scope.resetAlert("danger", "Va rugam selectati un grup preferat");
            }else if(!user.address){
                $scope.resetAlert("danger", "Va rugam introduceti o adresa");
            }else if(!county){
                $scope.resetAlert("danger", "Va rugam selectati un judet");
            }else if(!city){
                $scope.resetAlert("danger", "Va rugam selectati un oras");
            }else if(!this.termsStaywell){
                $scope.resetAlert("danger", "Trebuie sa acceptati termenii si conditiile Staywell pentru a continua");
            }else if(!this.termsMSD){
                $scope.resetAlert("danger", "Trebuie sa acceptati politica MSD privind datele profesionale pentru a continua");
            }else{

                var uploadData = function (userData, activationData) {
                    //console.log(userData);
                    //console.log(activationData);
                    CompleteProfileService.processData.save({user: userData, activation: activationData}).$promise.then(function (resp) {
                        console.log(resp);
                        if(resp.error){
                            $scope.resetAlert("danger", resp.error);
                        }else{
                            $window.location.href = "pro";
                        }
                    });
                };

                var activation = {
                    type: this.proofType,
                    value: null
                };

                if(this.proofType === "file"){
                    var extension = $scope.proofFile.name.split('.').pop();
                    Utils.fileToBase64($scope.proofFile, function (b64) {
                        activation.value = {
                            file: b64,
                            extension: extension
                        };
                        uploadData(user, activation);
                    });
                }else{
                    activation.value = activationCode;
                    uploadData(user, activation);
                }

            }
        }
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