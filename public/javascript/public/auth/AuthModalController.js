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
                //redirect to pro area
                $window.location.href = "pro";
            }
        })
    };

    $scope.signup = function () {
        console.log(this);
        if(this.terms){
            AuthService.signup.query({name: this.name, email: this.email, password: this.password, confirm: this.confirm, createdFromStaywell: true}).$promise.then(function (resp) {
                if(resp.error){
                    resetAlert("danger", resp.message);
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
        console.log(this);
    };

}]);