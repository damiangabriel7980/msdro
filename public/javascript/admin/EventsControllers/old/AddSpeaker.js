/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('AddSpeaker', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','growl', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,growl){
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.newSpeaker={
        first_name:  "",
        last_name:         "",
        profession:        "",
        last_updated: new Date(),
        workplace:       "",
        short_description:   "",
        image_path:""
    };
    $scope.createSpeaker=function(){
        $scope.newSpeaker.short_description=tinyMCE.activeEditor.getContent();
        EventsAdminService.getAllSpeakers.save($scope.newSpeaker).$promise.then(function(result){
            if(result.message)
                growl.addSuccessMessage(result.message);
            else
                growl.addWarnMessage(result);
        });
        $scope.newSpeaker = {};
    };
    $scope.okk=function(){
        $state.go('content.evenimente');
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
}]);
