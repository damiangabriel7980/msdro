var app = angular.module('app',
    [
        'oc.lazyLoad',
        'ui.router',
        'ui.bootstrap',
        'controllers',
        'services',
        'ngSanitize'
    ]);

app.config(['$controllerProvider', '$filterProvider', function ($controllerProvider, $filterProvider) {
    app.controllerProvider = $controllerProvider;
    app.filterProvider = $filterProvider;
}]);

app.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        //debug: true,
        modules: [
            {
                name: 'Auth',
                files: [
                    'javascript/public/AuthControllers/AuthModal.js',
                    'javascript/public/AuthControllers/Signup.js'
                ]
            },
            {
                name: 'selectAutocomplete',
                files: [
                    'modules/angular-select-autocomplete/directive.js',
                    'modules/angular-select-autocomplete/styles.css'
                ]
            },
            {
                name: 'FileUpload',
                files: [
                    'components/ng-file-upload/ng-file-upload.min.js'
                ]
            }
        ]
    });
}]);

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix(HASH_PREFIX);
}]);

var loadStateDeps = function (deps) {
    return ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load(deps);
    }]
};

app.run(
    [            '$rootScope', '$modal', '$sce', '$location',
        function ($rootScope,   $modal,   $sce,   $location) {

            //amazon service paths
            $rootScope.amazonBucket = DEFAULT_AMAZON_BUCKET;
            $rootScope.pathAmazonDev = DEFAULT_AMAZON_PREFIX+$rootScope.amazonBucket+"/";
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
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    windowClass: 'authModalNoPatients',
                    controller: 'AuthModal',
                    resolve:{
                        intent: function () {
                            return intent;
                        },
                        loadDeps: loadStateDeps(['Auth', 'selectAutocomplete', 'FileUpload'])
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

            if (REQUESTED_PRO) {
                REDIRECT_AFTER_LOGIN = $location.url();
                REQUESTED_PRO = 0;
            }
        }
    ]
);