publicControllers.controller('AuthModalController', ['$scope', '$modalInstance', 'intent', '$sce', 'AuthService', '$window', function($scope, $modalInstance, intent, $sce, AuthService, $window) {

    var resetAlert = function (type, text, show) {
        $scope.alert = {
            type: type?type:"danger",
            show: show?show:false,
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
        }
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    };

    $scope.login = function () {
        console.log(this);
        AuthService.login.query({email: this.email, password: this.password}).$promise.then(function (resp) {
            if(resp.error){
                resetAlert("danger", resp.message, true);
            }else{
                //redirect to pro area
                $window.location.href = "pro";
            }
        })
    };

    $scope.signup = function () {
        console.log(this);
    };

    $scope.reset = function () {
        console.log(this);
    };

}]);