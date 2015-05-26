controllers.controller('AuthModal', ['$scope', '$modalInstance', 'intent', '$sce', 'AuthService', '$window', 'Utils', function($scope, $modalInstance, intent, $sce, AuthService, $window, Utils) {

    $scope.resetAlert = function (type, text) {
        if(Utils.isMobile() && text){
            //on mobile, show alerts inside popup
            window.alert(text);
        }else{
            $scope.alert = {
                type: type?type:"danger",
                show: text?true:false,
                text: text?text:"Unknown error"
            }
        }
    };

    $scope.$watch('intent', function () {
        $scope.renderView(intent);
    });

    $scope.renderView = function (view, data) {
        $scope.resetAlert();
        $scope.modalTemplate = $sce.trustAsResourceUrl('partials/public/auth/'+view+'.html');
        $scope.modalData = data;
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    };

    $scope.showSignup = function () {
        $scope.renderView("signup", {
            template1: $sce.trustAsResourceUrl('partials/public/auth/signup_step1.html'),
            template2: $sce.trustAsResourceUrl('partials/public/auth/signup_step2.html')
        });
    };

    $scope.login = function () {

        AuthService.login.query({email: this.email, password: this.password,remember: this.remember}).$promise.then(function (resp) {

            if(resp.error){
                $scope.resetAlert("danger", resp.message);
            }else{
                //redirect to pro area or proof loading
                if(resp.accepted){
                    $window.location.href = "pro";
                }else{
                    $scope.renderView("completeProfile", {
                        template: $sce.trustAsResourceUrl('partials/public/auth/signup_step2.html')
                    });
                }
            }
        })
    };

    $scope.reset = function () {

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