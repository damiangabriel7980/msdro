var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    console.log(file);
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
    allTestFiles.push(normalizedTestModule);
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/',

  paths: {
    'jquery' : 'components/jquery/dist/jquery.min',
    'angular' : 'components/angular/angular',
    'resource': 'components/angular-resource/angular-resource.min.js',
    'ocLazyLoad' : 'components/oclazyload/dist/ocLazyLoad',
    'route': 'components/angular-route/angular-route.min.js',
    'router': 'components/angular-ui-router/release/angular-ui-router.min.js',
    'bootstrap': 'components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'animate': 'components/angular-animate/angular-animate.js',
    'App' : 'javascript/public/app',
    'controllers' : 'javascript/public/controllers',
    'services' : 'javascript/public/services',
    'sanitize' : 'components/angular-sanitize/angular-sanitize.min.js',
    'offClick': 'components/angular-off-click/offClick.js',
    'mobileContent' : 'modules/mobile_content_list/mobile_content_list.js',
    'footer': 'modules/sticky-footer/stick_footer.js',
    'hContent': 'modules/horizontal-content-list/directive.js',
    'mostRead': 'modules/widget-most-read/directive.js',
    'sharedControllers' : 'javascript/shared/controllers',
    'sharedDirectives' : 'javascript/shared/directives',
    'sharedServices' : 'javascript/shared/services',
    'directives' : 'javascript/public/publicDirectives',
    'filters' : 'javascript/public/publicFilters',
    'AuthModal': 'javascript/public/AuthControllers/AuthModal'
  },

  shim: {
    'jquery': {'exports': 'jquery'},
    'angular': {deps: ['jquery'], 'exports': 'angular'},
    'resource': {deps: ['angular'], 'exports': 'resource'},
    'ocLazyLoad' : {deps: ['angular'], 'exports': 'ocLazyLoad'},
    'route': {deps: ['angular'], 'exports': 'router'},
    'router': {deps: ['angular', 'route'], 'exports': 'router'},
    'bootstrap': {deps: ['angular'], 'exports': 'bootstrap'},
    'animate': {deps: ['angular'], 'exports': 'animate'},
    'App': {deps: ['angular'], 'exports': 'App'},
    'controllers': {deps: ['App'], 'exports': 'controllers'},
    'services': {deps: ['App'], 'exports': 'services'},
    'sanitize' : {'exports': 'sanitize'},
    'offClick': {deps: ['angular'], 'exports': 'offClick'},
    'mobileContent' : {deps: ['angular'], 'exports': 'mobileContent'},
    'footer': {deps: ['angular'], 'exports': 'footer'},
    'hContent': {deps: ['angular'], 'exports': 'hContent'},
    'mostRead': {deps: ['angular'], 'exports': 'mostRead'},
    'sharedControllers': {deps: ['App'], 'exports': 'sharedControllers'},
    'sharedDirectives' : {deps: ['App'], 'exports': 'sharedDirectives'},
    'sharedServices' : {deps: ['App'], 'exports': 'sharedServices'},
    'directives' : {deps: ['App'], 'exports': 'directives'},
    'filters' : {deps: ['App'], 'exports': 'filters'},
    'AuthModal' : {deps: ['App'], 'exports': 'AuthModal'}
  },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
