// Karma configuration
// Generated on Tue Apr 12 2016 14:49:04 GMT+0300 (EEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'public/',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      { pattern: 'components/jquery/dist/jquery.min.js', included: false},
      { pattern: 'components/angular/angular.js', included: false},
      { pattern: 'components/angular-resource/angular-resource.js', included: false},
      { pattern: 'components/oclazyload/dist/ocLazyLoad.js', included: false},
      { pattern: 'components/angular-route/angular-route.min.js', included: false},
      { pattern: 'components/angular-ui-router/release/angular-ui-router.min.js', included: false},
      { pattern: 'components/angular-bootstrap/ui-bootstrap-tpls.min.js', included: false},
      { pattern: 'components/angular-animate/angular-animate.js', included: false},
      { pattern: 'javascript/public/app.js', included: false},
      { pattern: 'javascript/public/controllers.js', included: false},
      { pattern: 'javascript/public/services.js', included: false},
      { pattern: 'components/angular-sanitize/angular-sanitize.min.js', included: false},
      { pattern: 'components/angular-off-click/offClick.js', included: false},
      { pattern: 'modules/mobile_content_list/mobile_content_list.js', included: false},
      { pattern: 'modules/sticky-footer/stick_footer.js', included: false},
      { pattern: 'modules/horizontal-content-list/directive.js', included: false},
      { pattern: 'modules/widget-most-read/directive.js', included: false},
      { pattern: 'javascript/shared/controllers.js', included: false},
      { pattern: 'javascript/shared/directives.js', included: false},
      { pattern: 'javascript/shared/services.js', included: false},
      { pattern: 'javascript/public/publicDirectives.js', included: false},
      { pattern: 'javascript/public/publicFilters.js', included: false},
      { pattern: 'javascript/public/AuthControllers/AuthModal.js', included: false},
      { pattern: 'tests/loginStaywelltest.js', included: false, served: true},
      'test-main.js'
    ],
    //
    // wiredep: {
    //       dependencies: true,    // default: true
    //       devDependencies: true // default: false
    // },



      // list of files to exclude
    exclude: [
      'modules/ace-builds/demo/kitchen-sink/demo.js'
    ],



    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
