controllers.controller('GridManager', ['$scope', function($scope){
	$(document).ready(function(){
        $("#mgrid").gridmanager({
        	debug: 1
        	//for tinyMCE customisation insert options here like:
        	//tinymce: { config: {options}}
        	//default looks like:`
        	/*
        	tinymce: {
        	    config: {
        	      inline: true,
        	      plugins: [
        	      "advlist autolink lists link image charmap print preview anchor",
        	      "searchreplace visualblocks code fullscreen",
        	      "insertdatetime media table contextmenu paste"
        	      ],
        	      toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
        	    }
        	}
        	 */
        });
    });
}]);