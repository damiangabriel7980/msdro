controllers.controller('myPrescriptionController',['$scope','myPrescriptionService','Success',function($scope, myPrescriptionService,Success){


		myPrescriptionService.info.query().$promise.then(function(resp){
			$scope.info = Success.getObject(resp)[0];
		}).catch(function(err){
			console.log(err);
		});


		var checkUrlsNumber = function(){
			if($scope.info.privacyPolicyUrl.indexOf('https')>-1 && $scope.info.termsOfUseUrl.indexOf('https')>-1){
					//it works
			}else{
				//show err
								console.log("err");
			}
		}

	$scope.update = function(){
		var toUpdate = {
			generalDescription:$scope.info.generalDescription,
			telefon:$scope.info.telefon,
			termsOfUseUrl:$scope.info.termsOfUseUrl,
			privacyPolicyUrl:$scope.info.privacyPolicyUrl
		};
		myPrescriptionService.info.update({id:$scope.info._id},{update:toUpdate}).$promise.then(function(resp){
			console.log(resp);
		}).catch(function(err){
			console.log(err);
		})
	};

	$scope.addPhone = function(){
			var newPhone = {
				name:"",
				number:""
			};
			$scope.info.telefon.push(newPhone);
	};



	$scope.removePhone = function(index){
		$scope.info.telefon.splice(index,1);
	}

	$scope.tinymceOptions = {
			selector: "textarea",
			plugins: [
					"advlist autolink lists link image charmap print preview anchor",
					"searchreplace visualblocks code fullscreen",
					"insertdatetime media table contextmenu paste charmap"
			],
			height: 240,
			width:715,
			toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
	};
}])
