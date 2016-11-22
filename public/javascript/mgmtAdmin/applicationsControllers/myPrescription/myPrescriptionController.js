controllers.controller('myPrescriptionController',['$scope','myPrescriptionService','Success','$timeout', 'tinyMCEConfig', function($scope, myPrescriptionService,Success,$timeout, tinyMCEConfig){


	myPrescriptionService.info.query().$promise.then(function(resp){
		$scope.info = Success.getObject(resp)[0];
	}).catch(function(err){
		console.log(err);
	});

	var resetMsg = function(){
		$timeout(function () {
			$scope.updateStatus = {}
		}, 3000);
	};


	var createErrMsg = function(msg){
		$scope.updateStatus = {
			show:true,
			message:msg,
			type:'danger'
		}
	};

	var createSuccessMsg = function(msg){
		$scope.updateStatus = {
			show:true,
			message:msg,
			type:"success"
		}
	};

	var checkAllFields = function(){
		if($scope.info.privacyPolicyUrl.indexOf('https') == -1){
			createErrMsg("Privacy Policy Url needs to be https");
			return false;
		}
		else if ($scope.info.termsOfUseUrl.indexOf('https') == -1){
			createErrMsg("Terms of use Url needs to be https");
			return false;
		}
		else {
			for(var i = 0; i < $scope.info.telefon.length; i++){
				if($scope.info.telefon[i].number && $scope.info.telefon[i].number.match(/[a-z]/i)){
					createErrMsg("The phone number can't contain letters");
					return false;
					break;
				}
			}
		}
		return true;
	};

	$scope.update = function(){
		var continueUpdate = checkAllFields();
		if(continueUpdate){
			var toUpdate = {
				generalDescription:$scope.info.generalDescription,
				telefon:$scope.info.telefon,
				termsOfUseUrl:$scope.info.termsOfUseUrl,
				privacyPolicyUrl:$scope.info.privacyPolicyUrl
			};
			myPrescriptionService.info.update({ id:$scope.info._id },{ update:toUpdate }).$promise.then(function(resp){
				createSuccessMsg("The update was successfull");
				resetMsg();
			}).catch(function(err){
				createErrMsg("Something went wrong");
			});
		}


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
	};

	$scope.tinymceOptions = tinyMCEConfig.standardConfig();
}]);
