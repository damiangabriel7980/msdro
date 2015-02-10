publicControllers.controller('AuthModalController', ['$scope', '$modalInstance', 'intent', '$sce', 'AuthService', '$window', function($scope, $modalInstance, intent, $sce, AuthService, $window) {

    var resetAlert = function (type, text, show) {
        $scope.alert = {
            type: type?type:"danger",
            show: show?show:false,
            text: text?text:"Unknown error"
        }
    };

    resetAlert();

    $scope.$watch('intent', function () {
        if(intent === "login"){
            $scope.modalTemplate = $sce.trustAsResourceUrl('partials/public/auth/login.html');
        }
    });

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
}]);