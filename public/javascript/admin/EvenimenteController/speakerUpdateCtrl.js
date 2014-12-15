/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('speakerUpdateCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','growl', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,growl){
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    EventsAdminService.deleteOrUpdateSpeakers.getSpeaker({id:$stateParams.id}).$promise.then(function(result){
        $scope.newSpeaker=result;
        tinyMCE.activeEditor.setContent($scope.newSpeaker.short_description);
    });
    $scope.updateSpeaker=function(){
        $scope.newSpeaker.short_description=tinyMCE.activeEditor.getContent();
        EventsAdminService.deleteOrUpdateSpeakers.update({id:$stateParams.id},$scope.newSpeaker).$promise.then(function(result){
        if(result.message)
                growl.addSuccessMessage(result.message);
        else
            growl.addWarnMessage(result);
        });

    };
    $scope.okk=function(){
        $state.go('continut.evenimente');
    };
    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };
}]);
