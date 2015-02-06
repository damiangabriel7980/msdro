proofApp.controller('ProofController', ['$scope', 'ProofService', '$sce', function($scope, ProofService, $sce) {

    $scope.myAlert = {
        newAlert: false,
        type: "info",
        message: ""
    };

    $scope.saveSuccess = false;

    var profession;
    var proofFile;
    var group;

    ProofService.professions.query().$promise.then(function (response) {
        $scope.professions = response;
    });

    $scope.selectProfession = function () {
        profession = $scope.selectedProfession;
        ProofService.specialGroups.query({profession: profession._id}).$promise.then(function (response) {
            $scope.groups = response;
        });
    };

    $scope.fileSelected = function($files, $event){
        //make sure a file was actually loaded
        if($files[0]){
            proofFile = $files[0];
            $scope.fileName = $files[0].name;
        }
    };

    $scope.selectSpecial = function () {
        group = $scope.selectedSpecialGroup;
        console.log(group);
    };

    $scope.saveAll = function () {
        if(!profession){
            $scope.myAlert.newAlert = true;
            $scope.myAlert.type = "danger";
            $scope.myAlert.message = "Va rugam selectati o profesie aferenta dovezii";
        }else if(!proofFile){
            $scope.myAlert.newAlert = true;
            $scope.myAlert.type = "danger";
            $scope.myAlert.message = "Va rugam incarcati o fotografie care sa dovedeasca statutul de "+profession.display_name;
        }else{
            var extension = proofFile.name.split('.').pop();

            var reader = new FileReader();

            $scope.myAlert.newAlert = true;
            $scope.myAlert.type = "success";
            $scope.myAlert.message = "Va rugam asteptati. Se incarca...";

            reader.onloadend = function(event){

                var image = event.target.result;
                var b64 = image.split("base64,")[1];

                ProofService.proofImage.save({encodedImage: b64, extension: extension, professionId: profession._id, groupId: group?group._id:null}).$promise.then(function (message) {
                    $scope.myAlert.type = message.type;
                    $scope.myAlert.message = message.message;
                    $scope.myAlert.newAlert = true;
                    if(message.success){
                        $scope.saveSuccess = true;
                    }
                });
            };

            reader.readAsDataURL(proofFile);

            // Read in the image file as a data URL.
        }
    };

    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    }

}]);