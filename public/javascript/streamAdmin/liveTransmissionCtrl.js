cloudStreamAdminControllers.controller('liveTransmissionCtrl', ['$scope', '$rootScope', '$stateParams', '$sce','$state','$window','$timeout', function($scope, $rootScope, $stateParams,$sce,$state,$window,$timeout){
    var flashvars = {};
    flashvars.inputUrl = "rtmp://qualitance.srfms.com:2111/live";
    flashvars.inputWidth = "480";
    flashvars.inputHeight = "360";
    flashvars.inputFrameRate = 40;
    flashvars.inputBandwidth = 0;
    flashvars.inputQuality = 100;
    flashvars.inputStreamName = "livestream";
    var params = {};
    params.quality = "high";
    params.bgcolor = "#ffffff";
    params.allowscriptaccess = "always";
    params.allowfullscreen = "true";
    params.wmode = "transparent";
    params.scale = "exactFit";
    var attributes = {};
    attributes.id = "simpleBroadcaster3";
    attributes.name = "simpleBroadcaster3";
    attributes.align = "middle";
    var swfVersionStr = "11.2.0";
    var xiSwfUrlStr = "javascript/streamAdmin/flash/playerProductInstall.swf";
    $(function () {
        swfobject.embedSWF("javascript/streamAdmin/flash/simpleBroadcaster3.swf", "myContent", "100%", "100%",
            swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);

        swfobject.createCSS("#myContent", "display:block;text-align:left;");
    });
}]);