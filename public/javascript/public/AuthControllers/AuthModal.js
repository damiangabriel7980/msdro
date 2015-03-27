controllers.controller('AuthModal', ['$scope', '$modalInstance', 'intent', '$sce', 'AuthService', '$window', function($scope, $modalInstance, intent, $sce, AuthService, $window) {

    $scope.resetAlert = function (type, text) {
        $scope.alert = {
            type: type?type:"danger",
            show: text?true:false,
            text: text?text:"Unknown error"
        }
    };

    $scope.$watch('intent', function () {
        $scope.renderView(intent);
    });

    $scope.renderView = function (view) {
        $scope.resetAlert();
        $scope.modalTemplate = $sce.trustAsResourceUrl('partials/public/auth/'+view+'.html');
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    };

    $scope.login = function () {
        console.log(this);
        AuthService.login.query({email: this.email, password: this.password,remember: this.remember}).$promise.then(function (resp) {
            console.log(resp);
            if(resp.error){
                $scope.resetAlert("danger", resp.message);
            }else{
                //redirect to pro area or proof loading
                if(resp.accepted){
                    $window.location.href = "pro";
                }else{
                    $scope.renderView("completeProfile");
                }
            }
        })
    };

    $scope.reset = function () {
        console.log(this.email);
        if(this.email==undefined)
        {
            $scope.resetAlert("danger","Email-ul este obligatoriu!");
        }
        else{
            AuthService.reset.query({email: this.email}).$promise.then(function (resp) {
                var message = resp.message;
                if(message.hasError){
                    $scope.resetAlert("danger",message.text);
                }else{
                    $scope.resetAlert("success",message.text);
                }
            });
        }

    };

}]);