app.controller('ActivationCode', ['$scope', 'ActivationCodeService', '$window', function($scope, ActivationCodeService, $window) {

    var lockSubmitting = false;

    ActivationCodeService.professions.query().$promise.then(function (response) {
        lockSubmitting = true;
        $scope.professions = response;
        $scope.selectedProfession = response[0]._id;
        $scope.selectProfession();
    });

    $scope.selectProfession = function () {
        ActivationCodeService.specialGroups.query({profession: $scope.selectedProfession}).$promise.then(function (response) {
            $scope.groups = response;
            $scope.selectedSpecialGroup = response[0]._id;
            lockSubmitting = false;
        });
    };

    $scope.sendActivationForm = function () {
        if(!lockSubmitting){
            console.log(this);
            if(!this.selectedProfession){
                $scope.resetAlert("danger", "Va rugam selectati o profesie");
            }if(!this.activationCode){
                $scope.resetAlert("danger", "Va rugam introduceti codul de activare");
            }else{
                ActivationCodeService.processData.save({professionId: this.selectedProfession, groupId: this.selectedSpecialGroup, activationCode: this.activationCode}).$promise.then(function (resp) {
                    if(resp.error){
                        $scope.resetAlert("danger", "A aparut o eroare pe server");
                    }else{
                        if(resp.activated){
                            $window.location.href = "pro";
                        }else{
                            $scope.resetAlert("danger", "Codul de activare nu este valid");
                        }
                    }
                });
            }
        }
    };

}]);