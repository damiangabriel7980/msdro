controllers.controller('myPrescriptionController',['$scope','myPrescriptionService','Success',function($scope, myPrescriptionService,Success){


		myPrescriptionService.info.query().$promise.then(function(resp){
			$scope.info = Success.getObject(resp)[0];
		}).catch(function(err){
			console.log(err);
		})


	$scope.update = function(){

	};

	$scope.addPhone = function(){

	};
}])
