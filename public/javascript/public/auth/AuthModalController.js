publicControllers.controller('AuthModalController', ['$scope', '$modalInstance', 'intent', '$sce', 'AuthService', '$window', function($scope, $modalInstance, intent, $sce, AuthService, $window) {

    var resetAlert = function (type, text) {
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
        resetAlert();
        if(view === "login"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/public/auth/login.html');
        }else if(view === "signup"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/public/auth/signup.html');
        }else if(view === "reset"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/public/auth/reset.html');
        }else if(view === "created"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/public/auth/created.html');
        }else if(view === "activationSuccess"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/public/auth/activationSuccess.html');
        }else if(view === "activationFailed"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/public/auth/activationFailed.html');
        }else if(view === "loadProof"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/public/auth/loadProof.html');
        }
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    };

    $scope.login = function () {
        console.log(this);
        AuthService.login.query({email: this.email, password: this.password}).$promise.then(function (resp) {
            if(resp.error){
                resetAlert("danger", resp.message);
            }else{
                //redirect to pro area or proof loading
                if(resp.proof){
                    $window.location.href = "pro";
                }else{
                    $scope.renderView("loadProof");
                }
            }
        })
    };

    $scope.signup = function () {
        console.log(this);
        var pass = this.password;
        var conf = this.confirm;
        this.password="";
        this.confirm="";
        if(this.terms){
            AuthService.signup.query({first_name: this.first_name,last_name: this.last_name, email: this.email, password: pass, confirm: conf, createdFromStaywell: true}).$promise.then(function (resp) {
                if(resp.error){
                    resetAlert("danger", resp.message);
                    console.log($scope);
                    $scope.$apply();
                }else{
                    $scope.registeredAddress = resp.user;
                    $scope.renderView("created");
                }
            })
        }else{
            resetAlert("danger", "Trebuie sa acceptati termenii si conditiile pentru a continua");
        }
    };

    $scope.reset = function () {
        AuthService.reset.query({email: this.email}).$promise.then(function (resp) {
            var message = resp.message;
            if(message.hasError){
                resetAlert("danger",message.text);
            }else{
                resetAlert("success",message.text);
            }
        });
    };

}]);