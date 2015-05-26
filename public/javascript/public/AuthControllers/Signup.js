app.controller('Signup', ['$scope', 'AuthService', '$window', 'Utils', function($scope, AuthService, $window, Utils) {

    //================================================================================================== init variables
    $scope.user = {
        subscriptions: {
            newsletterStaywell: false,
            infoMSD: false
        },
        temp: {
            proofFile: null
        }
    };

    $scope.nonUser = {};

    $scope.lockSubmitting = false;

    $scope.codeTooltip = "Deoarece statul roman, prin legea 95/2006 cu HCS nr 27_11.10.2013 " +
        "reglementeaza publicitatea medicamentelor doar catre specialisti in domeniul sanatatii, " +
        "va rugam sa introduceti codul care atesta dovada calitatii dvs de profesionist in domeniul " +
        "sanatatii (medic/farmacist). Daca nu aveti un cod de activare, va rugam sa contactati " +
        "un reprezentant MSD sau sa sunati la numarul de telefon ...";

    $scope.proofAlert = function () {
        window.alert($scope.codeTooltip);
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

    $scope.infoSources = [
        {id: 1, name: 'Internet'},
        {id: 2, name: 'Recomandarea unui coleg'},
        {id: 3, name: 'Email'},
        {id: 4, name: 'Congress'},
        {id: 5, name: 'Reprezentant MSD'},
        {id: 6, name: 'Reviste medicale'},
        {id: 7, name: 'Publicitate online'},
        {id: 0, name: 'Altele'}
    ];

    $scope.infoSource = {
        type: {}
    };

    //============================================================================================== profession / group

    $scope.selectProfession = function () {
        AuthService.signupGroups.query({profession: $scope.user.profession}).$promise.then(function (response) {
            $scope.groups = response;
            if(response[0]) $scope.user.groupsID = response[0]._id;
        });
    };

    AuthService.professions.query().$promise.then(function (response) {
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
            AuthService.cities.query({county: $scope.county.selected._id}).$promise.then(function (resp) {
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
    AuthService.counties.query().$promise.then(function (resp) {
        $scope.counties = resp.success;
    });

    //====================================================================================================== load proof

    $scope.proofSelected = function ($files, $event) {
        if(($files||[])[0]){
            $scope.user.temp.proofFile = $files[0];
        }
    };

    //========================================================================================================== submit

    var sendInfoSource = function (is) {
        //get info source value and sent it to google analytics
        var infoSource;
        if(is){
            if(is.type.id == 0){
                infoSource = is.type.name;
                if(is.text){
                    infoSource += " ("+is.text+")";
                }else{
                    infoSource += " (nespecificat)";
                }
            }else{
                infoSource = is.type.name;
            }
        }
        console.log(infoSource);
        //send info source stats
        if(infoSource && window.ga){
            console.log("Send info source");
            ga('send', {
                hitType: 'event',
                eventCategory: 'userStats',
                eventAction: 'pickInformationSource',
                eventLabel: infoSource
            });
        }
    };

    $scope.completeProfile = function () {
        var is = this.infoSource;
        AuthService.completeProfile(this, function (err, resp) {
            if(err){
                $scope.resetAlert("danger", err);
            }else{
                console.log(resp);
                if(resp.error){
                    $scope.resetAlert("danger", resp.message);
                }else{
                    sendInfoSource(is);
                    if(resp.state === "ACCEPTED"){
                        $window.location.href = "pro";
                    }else{
                        //awaiting proof acceptance (48 h)
                        $scope.renderView("awaitingProofAcceptance", {registeredAddress: resp.user, title: "Completare profil"});
                    }
                }
            }
        });
    };

    $scope.createAccount = function () {
        $scope.lockSubmitting = true;
        var is = this.infoSource;
        //send data
        AuthService.createAccount(this, function (err, resp) {
            $scope.lockSubmitting = false;
            if(err){
                $scope.resetAlert("danger", err);
            }else{
                console.log(resp);
                if(resp.error){
                    $scope.resetAlert("danger", resp.message);
                }else{
                    sendInfoSource(is);
                    if(resp.state === "ACCEPTED"){
                        //awaiting email activation; you will soon receive it
                        $scope.renderView("awaitingEmailActivation", {registeredAddress: resp.user});
                    }else{
                        //awaiting proof acceptance (48 h)
                        $scope.renderView("awaitingProofAcceptance", {registeredAddress: resp.user, title: "Creare cont"});
                    }
                }
            }
        });
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