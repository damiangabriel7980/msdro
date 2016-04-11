var conferenceApp = angular.module('conferenceApp', ['qConferencesApp']);
conferenceApp.controller('ConferenceController', ['$scope', '$window', function($scope, $window){
	$scope.closeConferenceWindow = function(){
		$window.close();
	}
}])