/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('ConferencesAddCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','growl','AmazonService', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,growl,AmazonService){

    EventsAdminService.getAllConferences.query().$promise.then(function(resp){
        $scope.rooms=resp;
        $scope.selectedRoom=$scope.rooms[0];
    });
    $scope.newConference={
        title:  "",
        enable:         true,
        begin_date:        "",
        last_updated: new Date(),
        end_date:"",
        qr_code:        {
            message:"",
            conference_id:"",
            type: 2
        },
        description:"",
        image_path:""
    };

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

    $scope.createConference=function(){
        console.log($scope.newConference);
        if($scope.newConference){
            EventsAdminService.getAllConferences.save($scope.newConference).$promise.then(function(result){
                if(result.message)
                    growl.addSuccessMessage(result.message);
                else
                    growl.addWarnMessage(result);
            });
            console.log($scope.newConference);
            $scope.newConference = {};
        }
    };
    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };
    $scope.okk=function(){
      $state.go('continut.evenimente');
    };

}]);
