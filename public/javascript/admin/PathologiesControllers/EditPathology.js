/**
 * Created by miricaandrei23 on 27.11.2014.
 */
controllers.controller('EditPathology', ['$scope','$rootScope' ,'PathologiesService','$modalInstance','$state','AmazonService', 'idToEdit', 'Success', 'Error', 'SpecialAppsService', 'tinyMCEConfig', 'DivisionsService', function($scope,$rootScope,PathologiesService,$modalInstance,$state,AmazonService,idToEdit,Success,Error, SpecialAppsService, tinyMCEConfig, DivisionsService){

    $scope.pathology = {};

    $scope.tinymceOptions = tinyMCEConfig.standardConfig();

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};

    var showAlertMessage = function (alertBoxName, type, message, status) {
        $scope[alertBoxName].type = type;
        $scope[alertBoxName].message = message;
        $scope[alertBoxName].newAlert = status;
    };

    $scope.myApps = {
        selectedApps: null
    };

    DivisionsService.divisions.query().$promise.then(function (resp) {
        $scope.activationCodes =  Success.getObject(resp);
    });

    PathologiesService.pathologies.query({id: idToEdit}).$promise.then(function(response){
        $scope.pathology = Success.getObject(response);
        if($scope.pathology.specialApps){
            $scope.myApps.selectedApps = $scope.pathology.specialApps
        }
        $scope.editableTabs = [
            {
                title: 'Descriere',
                model: $scope.pathology.description,
                propertyUsedToBind : 'description'
            },
            {
                title: 'Short description',
                model: $scope.pathology.short_description,
                propertyUsedToBind : 'short_description'
            }
        ];
        SpecialAppsService.apps.query().$promise.then(function (resp) {
            $scope.apps = Success.getObject(resp);
        });
        $scope.$applyAsync();
    }).catch(function(err){
        showAlertMessage('statusAlert', 'danger', Error.getMessage(err), true);
    });

    $scope.updatePathology = function(closeModal){
        $scope.pathology.last_updated = Date.now();
        if($scope.myApps.selectedApps){
            var id_apps = [];
            angular.forEach($scope.myApps.selectedApps, function (app, index) {
                id_apps.push(app._id);
            });
            $scope.pathology.specialApps = id_apps;
        }
        angular.forEach($scope.editableTabs, function (editableTab, key) {
            $scope.pathology[editableTab.propertyUsedToBind] = editableTab.model;
        });

        PathologiesService.pathologies.update({id: idToEdit}, $scope.pathology).$promise.then(function (resp) {
            if(closeModal){
                $scope.closeModal();
            } else {
                showAlertMessage('uploadAlert', 'success', 'Elementele multimedia au fost actualizate cu succes!', true);
            }
        }).catch(function(err){
            showAlertMessage('statusAlert', 'danger', Error.getMessage(err), true);
        });
    };

    var checkIfVideo = function (stringToCheck) {
        return (stringToCheck.indexOf('video') > -1)
    };

    $scope.headerIntroChanged = function (key, deleteItem) {
        if(deleteItem){
            checkIfVideo(key) ? $scope.pathology.video_intro = null : $scope.pathology.header_image = null;
        } else {
            checkIfVideo(key) ? $scope.pathology.video_intro = key : $scope.pathology.header_image = key;
        }
        $scope.updatePathology();
    };

    $scope.onMultimediaUpdate = function(key, toDelete){
        var normalizedKey = key.replace(/\s+/g, '%20');
        if(toDelete){
            var position = $scope.pathology.associated_multimedia.indexOf(normalizedKey);
            $scope.pathology.associated_multimedia.splice(position,1);
        } else {
            $scope.pathology.associated_multimedia.push(normalizedKey);
        }
        $scope.updatePathology();
    };

    $scope.closeModal = function () {
        $modalInstance.close();
        $state.go('pathologies',{},{reload: true});
    };
}]);
