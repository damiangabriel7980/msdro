controllers.controller('Signup', ['$scope', 'AuthService', function ($scope, AuthService) {

    $scope.titles = [
        {number: 1, name: "Dl"},
        {number: 2, name: "Dna"},
        {number: 3, name: "Prof"},
        {number: 4, name: "Dr"}
    ];

    $scope.signup = function () {
        console.log(this);
        if(!(this.email && this.title && this.name && this.password && this.confirm)){
            $scope.resetAlert("danger", "Toate campurile sunt obligatorii");
        }else if(!this.terms) {
            $scope.resetAlert("danger", "Trebuie sa acceptati termenii si conditiile pentru a continua");
        }else if(this.password != this.confirm) {
            $scope.resetAlert("danger", "Parolele nu corespund");
        }else{
            AuthService.signup.query({title: this.title, name: this.name, email: this.email, password: this.password, createdFromStaywell: true}).$promise.then(function (resp) {
                if(resp.error){
                    $scope.resetAlert("danger", resp.message);
                }else{
                    $scope.registeredAddress = resp.user;
                    $scope.renderView("created");
                }
            })
        }
    };

}]);