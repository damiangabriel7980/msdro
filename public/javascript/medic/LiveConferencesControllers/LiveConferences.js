app.controllerProvider.register('LiveConferences', ['$scope', '$rootScope', '$stateParams', '$sce','$state','$window','$timeout','CameraService', function($scope, $rootScope, $stateParams,$sce,$state,$window,$timeout,CameraService){

    $scope.snapshotImg = '';

    $scope.speakers = [
        {
            _id: 11,
            name: 'USer One 1',
            lastImage: ''
        },
        {
            _id: 22,
            name: 'USer One 2',
            lastImage: ''
        }
        , {
            _id: 33,
            name: 'USer One 3',
            lastImage: ''
        }, {
            _id: 44,
            name: 'USer One 4',
            lastImage: ''
        }, {
            _id: 55,
            name: 'USer One 5',
            lastImage: ''
        }, {
            _id: 66,
            name: 'USer One 6',
            lastImage: ''
        }, {
            _id: 77,
            name: 'USer One 7',
            lastImage: ''
        }
    ];

    $scope.currentSpeaker = $scope.speakers[0];

    $scope.viewers = [
        {
            _id: 11,
            name: 'V One 1',
            personalStream: ''
        },
        {
            _id: 22,
            name: 'V One 2',
            personalStream: ''
        }
        , {
            _id: 33,
            name: 'V One 3',
            personalStream: ''
        }, {
            _id: 44,
            name: 'V One 4',
            personalStream: ''
        }, {
            _id: 55,
            name: 'V One 5',
            personalStream: ''
        }, {
            _id: 66,
            name: 'V One 6',
            personalStream: ''
        }, {
            _id: 77,
            name: 'V One 7',
            personalStream: ''
        }
    ];

    $scope.makeSnapshot = function() {
        var _video = angular.element('#camera')[0];
        if (_video) {
            var patCanvas = angular.element('#snapshot')[0];
            if (!patCanvas)
                return;
            var ctxPat = patCanvas.getContext('2d');
            patCanvas.width = _video.videoWidth;
            patCanvas.height = _video.videoHeight;
            ctxPat.drawImage(_video, 0, 0);
            // "image/webp" works in Chrome.
            // Other browsers will fall back to image/png.
            return patCanvas.toDataURL('image/webp');
        }
    };

    $scope.mediaStreamSource = null;
    $scope.isSpeaker = true;

    var onSuccess = function(stream) {
            if (navigator.mozGetUserMedia) {
                $scope.streamSource = stream;
            } else {
                var vendorURL = window.URL || window.webkitURL;
                $scope.streamSource = $sce.trustAsResourceUrl(window.URL.createObjectURL(stream));
                setTimeout(function(){
                    $scope.speakers[0].lastImage = $scope.makeSnapshot();
                },3000);
            }
    };

    var onFailure = function(err) {
        console.log(err);
    };

    var succesAudio = function(stream){
        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        // grab an audio context
        var audioContext = new AudioContext();

        var mediaStreamSource = audioContext.createMediaStreamSource(stream);
        $scope.meter = CameraService.createAudioMeter(audioContext);
        mediaStreamSource.connect($scope.meter);
        $scope.$watch('meter.volume',function(newV,oldV){
            if($scope.meter.volume > 0.3 && $scope.currentSpeaker){
                stream = null;
                //// aici se va face schimbul de stream de la un speaker la altul
                $scope.streamSource = '';
                $scope.meter.shutdown();
                CameraService.getUserMediaAV(onSuccess,onFailure);
            }
        })
    };
    $scope.streamSource = $sce.trustAsResourceUrl('ceaeav');
    if($scope.isSpeaker){
        if($scope.streamSource){
            CameraService.getUserMediaAOnly(succesAudio,onFailure);
        }else {
            CameraService.getUserMediaAV(onSuccess,onFailure);
        }
    }
}]);