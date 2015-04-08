var app = angular.module('app',
    [
        'ui.bootstrap',
        'controllers',
        'services',
        'angularFileUpload'
    ]);

app.run(
    [            '$rootScope', '$modal', '$sce',
        function ($rootScope,   $modal,   $sce) {

            //amazon service paths
            $rootScope.amazonBucket = DEFAULT_AMAZON_BUCKET;
            $rootScope.pathAmazonDev = "https://s3-eu-west-1.amazonaws.com/"+$rootScope.amazonBucket+"/";
            $rootScope.pathAmazonResources = $rootScope.pathAmazonDev+"resources/";

            $rootScope.merckManualImage = $rootScope.pathAmazonResources+"merckManual.jpg";

            $rootScope.defaultArticleImage = $rootScope.pathAmazonResources+"article.jpg";
            $rootScope.defaultVideoImage = $rootScope.pathAmazonResources+"video.png";
            $rootScope.defaultSlideImage = $rootScope.pathAmazonResources+"slide.png";

            //global functions
            $rootScope.htmlToPlainText = function(text) {
                return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
            };
            $rootScope.createHeader = function (text,length) {
                var textLength = text?text.length:0;
                if(textLength > length){
                    var trimmed = $rootScope.htmlToPlainText(text).substring(0,length);
                    var i = trimmed.length;
                    while(trimmed[i]!=' ' && i>0) i--;
                    trimmed = trimmed.substr(0, i);
                    if(trimmed.length > 0) trimmed = trimmed+"...";
                    return trimmed;
                }else{
                    return $rootScope.htmlToPlainText(text);
                }
            };
            $rootScope.trustAsHtml = function (data) {
                return $sce.trustAsHtml(data);
            };

            //auth modal
            $rootScope.showAuthModal = function(intent){
                $modal.open({
                    templateUrl: 'partials/public/auth/baseModal.html',
                    backdrop: 'static',
                    keyboard: false,
                    windowClass: 'authModalNoPatients',
                    controller: 'AuthModal',
                    resolve:{
                        intent: function () {
                            return intent;
                        }
                    }
                });
            };

            if(REQUESTED_STAYWELL_ACTIVATION == 1){
                REQUESTED_STAYWELL_ACTIVATION = 0;
                if(ACTIVATED_STAYWELL_ACCOUNT == 1){
                    ACTIVATED_STAYWELL_ACCOUNT = 0;
                    $rootScope.showAuthModal("activationSuccess");
                }else{
                    $rootScope.showAuthModal("activationFailed");
                }
            }else{
                $rootScope.showAuthModal("login");
            }
        }
    ]
);