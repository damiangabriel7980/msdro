app.controllerProvider.register('previewModalController',['$scope','$modalInstance','conference','$state',function($scope,$modalInstance,conference,$state){
  navigator.getUserMedia = ( navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia);

   var webcamStream;

   function startWebcam() {
    if (navigator.getUserMedia) {
    navigator.getUserMedia (

     // constraints
     {
       audio: false,
       video: true
     },

     // successCallback
      function(localMediaStream) {
       var video = document.querySelector('video');
       video.src = window.URL.createObjectURL(localMediaStream);
       webcamStream = localMediaStream;
     },

     // errorCallback
      function(err) {
        console.log("The following error occured: " + err);
        }
 );
   } else {
     console.log("getUserMedia not supported");
   }
  }

   function stopWebcam() {
   webcamStream.stop();
   }

   startWebcam();

   $scope.cancel = function(){
     $modalInstance.close();
   };

   $scope.goToConference = function(){
     console.log(conference);
     $state.go('elearning.conferinta',{conferenceId:conference._id},{},{reload:true});
   }
}]);
