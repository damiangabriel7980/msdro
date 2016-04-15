var app = angular.module('app',
    [
        'ui.router',
        'controllers',
        'services',
        'ngTable',
        'ngFileUpload',
        'ui.tinymce',
        'angularSelectAutocomplete',
        'ja.qr',
        'ui.bootstrap.datetimepicker',
        'myMultipleSelect',
        'therapeuticSelect',
        's3UploadManager',
        'enhancedS3UploadManager',
        'adminEmailsList',
        'adminWidgetStats',
        'ui.ace',
        'ngCsv',
        'ngAnimate',
        'vAccordion',
        'ui.tree',
        'ui.select',
        'ngSanitize',
        'actionButtons',
        'bulkOperations'
    ]);

app.config(['$locationProvider', function($location) {
    $location.hashPrefix('!');
}]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/users/manageAccounts");
    $stateProvider
        .state('users', {
            abstract: true,
            url: '/users',
            templateUrl: 'partials/admin/users/root.html'
        })
        .state('users.manageAccounts',{
            url: '/manageAccounts',
            templateUrl: 'partials/admin/users/manageAccounts.html',
            controller: 'ManageAccounts'
        })
        .state('users.newAccounts',{
            url: '/newAccounts',
            templateUrl: 'partials/admin/users/newAccounts/root.html',
            controller: 'NewAccounts'
        })
        .state('users.newAccounts.accepted',{
            url: '/accepted',
            templateUrl: 'partials/admin/users/newAccounts/accepted.html',
            controller: 'UsersAccepted'
        })
        .state('users.newAccounts.rejected',{
            url: '/rejected',
            templateUrl: 'partials/admin/users/newAccounts/rejected.html',
            controller: 'UsersRejected'
        })
        .state('users.newAccounts.pending',{
            url: '/pending',
            templateUrl: 'partials/admin/users/newAccounts/pending.html',
            controller: 'UsersPending'
        })
        .state('users.groups',{
            url: '/groups',
            templateUrl: 'partials/admin/users/groups/root.html',
            controller: 'Groups'
        })
        .state('users.importUsers',{
            url: '/importUsers',
            templateUrl: 'partials/admin/users/importUsers.html'
        })
        .state('content', {
            abstract: true,
            url: '/content',
            templateUrl: '/partials/admin/content/root.html'
        })
        .state('content.produse',{
            url: '/produse',
            templateUrl: 'partials/admin/content/products/root.html',
            controller:'Products'
        })
        .state('content.specialApps',{
            url: '/specialApps',
            templateUrl: 'partials/admin/content/specialApps/viewAll.html',
            controller:'ViewSpecialApps'
        })
        .state('content.specialProducts',{
            url: '/specialProducts',
            templateUrl: 'partials/admin/content/specialProducts/viewAll.html',
            controller:'ProductPage'
        })
        .state('content.articles',{
            url: '/articles',
            templateUrl: 'partials/admin/content/articles/root.html',
            controller:'Articles'
        })
        .state('content.events',{
            url: '/events',
            templateUrl: 'partials/admin/content/events/root.html'
        })
        .state('content.events.editEvent',{
            url: '/editEvent/:idEvent',
            templateUrl: 'partials/admin/content/events/editEvent.html',
            controller: "EditEvent"
        })
        .state('content.events.editConference',{
            url: '/editConference/:idEvent/:idConference',
            templateUrl: 'partials/admin/content/events/editConference.html',
            controller: "EditConference"
        })
        .state('content.events.editTalk',{
            url: '/editTalk/:idEvent/:idConference/:idTalk',
            templateUrl: 'partials/admin/content/events/editTalk.html',
            controller: "EditTalk"
        })
        .state('content.events.editRoom',{
            url: '/editRoom/:idEvent/:idRoom',
            templateUrl: 'partials/admin/content/events/editRoom.html',
            controller: "EditRoom"
        })
        .state('content.events.viewAll',{
            url: '/viewAll',
            templateUrl: 'partials/admin/content/events/filter.html'
        })
        .state('content.events.viewAll.events',{
            url: '/events',
            templateUrl: 'partials/admin/content/events/viewEvents.html',
            controller: "ViewEvents"
        })
        .state('content.events.viewAll.speakers',{
            url: '/speakers',
            templateUrl: 'partials/admin/content/events/viewSpeakers.html',
            controller: "ViewSpeakers"
        })
        .state('content.intro',{
            url: '/intro',
            templateUrl: 'partials/admin/content/intro.html',
            controller: 'Intro'
        })
        .state('content.carouselMedic',{
            url: '/carouselMedic',
            templateUrl: 'partials/admin/content/carouselMedic/carouselMedic.html',
            controller: 'CarouselMedic'
        })
        .state('content.carouselPublic',{
            url: '/carouselPublic',
            templateUrl: 'partials/admin/content/carouselPublic/carouselPublic.html',
            controller: 'CarouselPublic'
        })
        .state('content.publicContent',{
            url: '/publicContent',
            templateUrl: 'partials/admin/content/publicContent/root.html'
        })
        .state('content.publicContent.content',{
            url: '/content',
            templateUrl: 'partials/admin/content/publicContent/publicContent.html',
            controller: 'PublicContent'
        })
        .state('content.publicContent.categories',{
            url: '/categories',
            templateUrl: 'partials/admin/content/publicContent/categories/viewAll.html',
            controller: 'PublicCategories'
        })
        .state('newsletter', {
            abstract: true,
            url: '/newsletter',
            templateUrl: '/partials/admin/newsletter/newsletter.html'
        })
        .state('newsletter.dashboard',{
            url: '/dashboard',
            templateUrl: 'partials/admin/newsletter/dashboard.html',
            controller: 'NewsletterDashboard'
        })
        .state('newsletter.dashboard.campaigns',{
            url: '/campaigns',
            templateUrl: 'partials/admin/newsletter/campaigns/campaigns.html',
            controller: 'NewsletterCampaigns'
        })
        .state('newsletter.dashboard.distributionLists',{
            url: '/distributionLists',
            templateUrl: 'partials/admin/newsletter/distributionLists/distributionLists.html',
            controller: 'NewsletterDistributionLists'
        })
        .state('newsletter.dashboard.unsubscribedUsers',{
            url: '/unsubscribedUsers',
            templateUrl: 'partials/admin/newsletter/unsubscribedUsers/unsubscribedUsers.html',
            controller: 'NewsletterUnsubscribedUsers'
        })
        .state('newsletter.dashboard.unsubscribedEmails',{
            url: '/unsubscribedEmails',
            templateUrl: 'partials/admin/newsletter/unsubscribedEmails/unsubscribedEmails.html',
            controller: 'NewsletterUnsubscribedEmails'
        })
        .state('newsletter.dashboard.templates',{
            url: '/templates',
            templateUrl: 'partials/admin/newsletter/templates/templates.html',
            controller: 'NewsletterTemplates'
        })
        .state('elearning', {
            abstract: true,
            url: '/elearning',
            templateUrl: '/partials/admin/elearning/root.html'
        })
        .state('elearning.courses',{
            url: '/courses',
            templateUrl: 'partials/admin/elearning/courses/root.html',
            controller: 'Courses'
        })
        .state('elearning.courses.editCourse',{
            url: '/editCourse/:courseId/:courseNav',
            templateUrl: 'partials/admin/elearning/courses/courseEdit.ejs',
            controller: 'EditCourse'
        })
        .state('elearning.courses.editChapter',{
            url: '/editChapter/:chapterId/:courseNav',
            templateUrl: 'partials/admin/elearning/courses/chapterEdit.ejs',
            controller: 'EditChapter'
        })
        .state('elearning.courses.editSubChapter',{
            url: '/editSubChapter/:subChapterId/:courseNav',
            templateUrl: 'partials/admin/elearning/courses/subChapterEdit.ejs',
            controller: 'EditSubChapter'
        })
        .state('elearning.courses.editSlide',{
            url: '/course/:courseId/editSlide/:slideId/:courseNav',
            templateUrl: 'partials/admin/elearning/courses/slideEdit.ejs',
            controller: 'EditSlide'
        })
        .state('elearning.multimedia',{
            url: '/multimedia',
            templateUrl: 'partials/admin/elearning/multimedia/root.html',
            controller: 'Multimedia'
        })
        .state('elearning.multimedia.adaugaMultimedia',{
            parent:'elearning.multimedia',
            url: '',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                $modal.open({
                    templateUrl: 'partials/admin/elearning/multimedia/multimediaAdd.ejs',
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    windowClass: 'fade',
                    controller:"AddMultimedia"
                })
            }]
        })
        .state('ariiTerapeutice',{
            url: '/ariiTerapeutice',
            templateUrl: 'partials/admin/ariiTerapeutice/ariiTerapeutice.html',
            controller: 'TherapeuticAreas'
        })
        .state('applications', {
            abstract: true,
            url: '/applications',
            templateUrl: '/partials/admin/applications/applications.html'
        })
        .state('applications.qa',{
            url: '/qa',
            templateUrl: 'partials/admin/applications/qa/qa.html',
            controller: 'qaController'
        })
        .state('applications.contractManagement',{
            url: '/contractManagement',
            templateUrl: 'partials/admin/applications/contractManagement/viewAll.html',
            controller: 'ContractManagement'
        })
        .state('applications.DPOC',{
            url: '/DPOC',
            templateUrl: 'partials/admin/applications/DPOC/viewDevices.html',
            controller: 'ViewDevicesDPOC'
        })
        .state('applications.januvia',{
            url: '/januvia',
            templateUrl: 'partials/admin/applications/januvia/viewUsers.html',
            controller: 'JanuviaUsersView'
        })
        .state('applications.guideLines',{
            url:'/guidelines',
            templateUrl:'partials/admin/applications/guideLines/root.html'
        })
        .state('applications.guideLines.Category',{
            url:'/guidelines.Category',
            templateUrl:'partials/admin/applications/guideLines/guideLinesCategory.html',
            controller:'guideLinesCategoryController'
        })
        .state('applications.guideLines.File',{
            url:'/guidelines.File',
            templateUrl:'partials/admin/applications/guideLines/guideLinesFile.html',
            controller:'guideLineFileController'
    })
        .state('applications.myPrescription',{
            url:'/myPrescription',
            templateUrl:'partials/admin/applications/myPrescription/myPrescription.html',
            controller:'myPrescriptionController'
        })
        .state('applications.edit',{
            url:'/edit',
            templateUrl:'partials/admin/applications/appUpdate/appUpdate.html',
            controller:"AppUpdateController"
        })
        .state('system', {
            abstract: true,
            url: '/system',
            templateUrl: '/partials/admin/system/root.html'
        })
        .state('system.activationCodes', {
            url: '/activationCodes',
            templateUrl: '/partials/admin/system/activationCodes/activationCodes.html',
            controller: 'ActivationCodes'
        })
        .state('system.parameters', {
            url: '/parameters',
            templateUrl: '/partials/admin/system/parameters/parameters.html',
            controller: 'SystemParameters'
        })
}]);

app.run(
    [            '$rootScope', '$state', '$stateParams', 'Utils',
        function ($rootScope,   $state,   $stateParams,   Utils) {

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            //amazon service paths
            $rootScope.amazonBucket = 'msdqa';
            $rootScope.pathAmazonDev = 'https://s3-eu-west-1.amazonaws.com/' + $rootScope.amazonBucket+"/";

            $rootScope.pathAmazonResources = $rootScope.pathAmazonDev+"resources/";

            $rootScope.defaultVideoImage = $rootScope.pathAmazonResources+"video.png";
            $rootScope.defaultSlideImage = $rootScope.pathAmazonResources+"slide.png";
            $rootScope.defaultFileImage = $rootScope.pathAmazonResources+"file.png";

            $rootScope.trustAsHtml = Utils.trustAsHtml;
        }
    ]
);
