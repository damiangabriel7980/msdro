proofApp.controller('ProofController', ['$scope', 'ProofService', '$sce', function($scope, ProofService, $sce) {

    $scope.myAlert = {
        newAlert: false,
        type: "info",
        message: ""
    };

    ProofService.professions.query().$promise.then(function (response) {
        $scope.professions = response;
        console.log(response);
    });

    $scope.fileSelected = function($files, $event){
        //make sure a file was actually loaded
        if($files[0]){
            var extension = $files[0].name.split('.').pop();

            var reader = new FileReader();

            $scope.myAlert.newAlert = true;
            $scope.myAlert.type = "success";
            $scope.myAlert.message = "Va rugam asteptati. Se incarca...";

            reader.onloadend = function(event){

                var image = event.target.result;
                var b64 = image.split("base64,")[1];

                ProofService.proofImage.save({encodedImage: b64, extension: extension}).$promise.then(function (message) {
                    $scope.myAlert.type = message.type;
                    $scope.myAlert.message = message.message;
                    $scope.myAlert.newAlert = true;
                });
            };

            reader.readAsDataURL($files[0]);

            // Read in the image file as a data URL.
        }
    };

    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    }

}]);