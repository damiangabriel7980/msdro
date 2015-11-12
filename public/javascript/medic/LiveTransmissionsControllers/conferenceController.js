app.controllerProvider.register('ConferenceController',['$scope','ActionModal',function($scope,ActionModal){

 $scope.menuToggled = false;

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
       var video1 = document.getElementsByClassName('me')[0];
       var video2 = document.getElementsByClassName('me')[1];
       var video3 = document.getElementsByClassName('me')[2];
       var video4 = document.getElementsByClassName('me')[3];
       video1.src = window.URL.createObjectURL(localMediaStream);
       video2.src = window.URL.createObjectURL(localMediaStream);
       video3.src = window.URL.createObjectURL(localMediaStream);
       video4.src = window.URL.createObjectURL(localMediaStream);
       webcamStream = localMediaStream;
     },

     // errorCallback
      function(err) {
        console.log(err);
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

   $scope.closeConference = function(){
     ActionModal.show("Inchide-ti conferinta","Sunteti sigur ca doriti sa inchide-ti conferinta",function(){
       console.log("conferinta Inchisa");
     },{
       yes:"Da"
     })
   };

   $scope.toggleMenu = function(){
     $scope.menuToggled = !$scope.menuToggled;
   }

   //make query to see the info for the conference
}]);
