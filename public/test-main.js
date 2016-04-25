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
    'app' : 'public/javascript/public/app',
    'controllers' : 'public/javascript/public/controllers',
    'services' : 'public/javascript/public/services',
    'mobilecontent' : 'public/modules/mobile_content_list/mobile_content_list.js',
    'footer': 'public/modules/sticky-footer/stick_footer.js',
    'hcontent': 'public/modules/horizontal-content-list/directive.js',
    'mostread': 'public/modules/widget-most-read/directive.js',
    'sharedcontrollers' : 'public/javascript/shared/controllers',
    'shareddirectives' : 'public/javascript/shared/directives',
    'sharedservices' : 'public/javascript/shared/services',
    'directives' : 'public/javascript/public/publicDirectives',
    'filters' : 'public/javascript/public/publicFilters',
    'authmodal': 'public/javascript/public/AuthControllers/AuthModal'
  },

  shim: {
    'app': {'exports': 'app'},
    'controllers': {deps: ['app'], 'exports': 'controllers'},
    'services': {deps: ['app'], 'exports': 'services'},
    'mobilecontent' : {'exports': 'mobilecontent'},
    'footer': {'exports': 'footer'},
    'hcontent': {'exports': 'hcontent'},
    'mostread': {'exports': 'mostread'},
    'sharedcontrollers': {deps: ['controllers'], 'exports': 'sharedcontrollers'},
    'shareddirectives' : {deps: ['controllers'], 'exports': 'shareddirectives'},
    'sharedservices' : {deps: ['controllers'], 'exports': 'sharedservices'},
    'directives' : {deps: ['app'], 'exports': 'directives'},
    'filters' : {deps: ['app'], 'exports': 'filters'},
    'authmodal' : {deps: ['app'], 'exports': 'authmodal'}
  },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
