var conferenceApp = angular.module('conferenceApp', ['qConferencesApp']);
conferenceApp.controller('ConferenceController', ['$scope', function($scope){
	$scope.conferenceId = CONFERENCE_ID;
}])