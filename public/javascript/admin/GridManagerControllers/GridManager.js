controllers.controller('GridManager', ['$scope', function($scope){
	$(document).ready(function(){
        $("#mgrid").gridmanager({
        	debug: 1,
        	rte: "ckeditor"
        });
    });
}]);