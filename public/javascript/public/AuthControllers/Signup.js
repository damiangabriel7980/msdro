app.controllerProvider.register('Signup', ['$scope', 'AuthService', '$window', 'Utils', 'Success', function($scope, AuthService, $window, Utils, Success) {

    //================================================================================================== init variables
    $scope.user = {
        subscriptions: {
            newsletterStaywell: true,
            infoMSD: true
        },
        temp: {
            proofFile: null
        },
        registeredFrom: "Staywell"
    };

    $scope.nonUser = {};

    if($scope.modalData && $scope.modalData.username) $scope.user.username = $scope.modalData.username;

    $scope.lockSubmitting = false;

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
    //============================================================================================== specialty
    AuthService.specialty.query({}).$promise.then(function(specialties) {
        $scope.specialties =  Success.getObject(specialties);
    });

    //============================================================================================== profession / group

    $scope.selectProfession = function () {
        AuthService.signupGroups.query({profession: $scope.user.profession}).$promise.then(function (response) {
            response = Success.getObject(response);
            $scope.groups = response;
            $scope.user.groupsID = response[0]?response[0]._id:null;
        });
    };

    AuthService.professions.query().$promise.then(function (response) {
        response = Success.getObject(response);
        $scope.professions = response;
        $scope.user.profession = response.length ? response[0]._id : null
        $scope.selectProfession();
    });

    //=================================================================================================== county / city

    $scope.city = {};
    $scope.county = {};

    // get counties and cities
    AuthService.counties.query().$promise.then(function (resp) {
        $scope.counties = Success.getObject(resp);
    });

    $scope.countyWasSelected = function (county) {
        if(county && county._id){
            AuthService.cities.query({county: county._id}).$promise.then(function (resp) {
                $scope.cities = Success.getObject(resp).sort(function(a,b){
                    if ( a.name < b.name )
                        return -1;
                    if ( a.name > b.name )
                        return 1;
                    return 0;
                });
                $scope.city.selected = {};
            });
        }else{
            $scope.cities = [];
        }
    };

    //====================================================================================================== load proof

    $scope.proofSelected = function ($files, $event) {
        if(($files||[])[0]){
            $scope.user.temp.proofFile = $files[0];
        }
    };

    $scope.$watch("user.username", function(newValue){
        $scope.proofRequired = AuthService.isProofRequired(newValue);
    });

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

        //send info source stats
        if(infoSource && window.ga){

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

                if(resp.error){
                    $scope.resetAlert("danger", resp.message);
                }else{
                    sendInfoSource(is);
                    if(resp.state === "ACCEPTED"){
                        $window.location.href = AuthService.getProHref();
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

}]);