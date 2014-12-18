/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('conferenceUpdateCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','ngTableParams','growl', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,ngTableParams,growl){


    $scope.string = "";

    EventsAdminService.getAllRoom.query().$promise.then(function(resp) {
        $scope.rooms = resp;
        EventsAdminService.deleteOrUpdateConferences.getConference({id: $stateParams.id}).$promise.then(function (result2) {

            $scope.newConference = result2;
            $scope.string = JSON.stringify($scope.newConference.qr_code);
            console.log(result2);
        });
    });
    $scope.messageString="";

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.open1 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened1 = true;
    };
    $scope.open2 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened2 = true;
    };
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.updateConference=function(){
        $scope.utc1 = new Date($scope.newConference.begin_date);
        $scope.utc2 = new Date($scope.newConference.end_date);
        $scope.newConference.begin_date=$scope.utc1;
        $scope.newConference.end_date=$scope.utc2;
        console.log($scope.newConference);
        if($scope.newConference){
            EventsAdminService.deleteOrUpdateConferences.update({id: $stateParams.id}, $scope.newConference).$promise.then(function(result){
                if(result.message)
                    growl.addSuccessMessage(result.message);
                else
                    growl.addWarnMessage(result);
            });
        }
    };

    $scope.okk=function(){
        $state.go('continut.evenimente');
    }
    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

}])
    .filter("asDate", function () {
        return function (input) {
            return new Date(input);
        }
    });

