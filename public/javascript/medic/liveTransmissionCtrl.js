cloudAdminControllers.controller('liveTransmissionCtrl', ['$scope', '$rootScope', '$stateParams', '$sce','$state','$window','$timeout', function($scope, $rootScope, $stateParams,$sce,$state,$window,$timeout){
    var swfVersionStr = "11.2.0";
    var xiSwfUrlStr = "components/flash/playerProductInstall.swf";
    var flashvars = {};
    flashvars.inputUrl = "rtmp://qualitance.srfms.com:2111/live";
    flashvars.inputWidth = "480";
    flashvars.inputHeight = "360";
    flashvars.inputStreamName = "livestream";
    flashvars.inputNoSignalImage = "https://s3-eu-west-1.amazonaws.com/msdapp/resources/rsz_no_signal.jpg";
    var params = {};
    params.quality = "high";
    params.bgcolor = "#ffffff";
    params.allowscriptaccess = "always";
    params.allowfullscreen = "true";
    params.wmode = "transparent";
    params.scale = "exactFit";
    var attributes = {};
    attributes.id = "simpleSubscriber3";
    attributes.name = "simpleSubscriber3";
    attributes.align = "middle";
    $(function () {
        swfobject.embedSWF("components/flash/simpleSubscriber3.swf", "myContent", "100%", "100%", swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);
        swfobject.createCSS("#myContent", "display:block;text-align:left;width: 100%;height: 100%");

        /* if($.fullscreen.isNativelySupported()) {
         //show full screen button
         $("#toggleFullScreen").show();
         }

         $("#toggleFullScreen").click(function() {
         $("#videoContainer").fullscreen();
         });*/
    });
}]);