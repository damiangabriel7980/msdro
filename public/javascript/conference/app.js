var conferenceApp = angular.module('conferenceApp', ['qConferencesFrontEnd']);
conferenceApp.controller('ConferenceController', ['$scope', function($scope){
	$scope.test = "works man!";
}])