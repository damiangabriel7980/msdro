// Karma configuration
// Generated on Thu Apr 07 2016 15:39:59 GMT+0300 (EEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      { pattern: 'public/components/jquery/dist/jquery.min.js', included: true},
      { pattern: 'public/components/jquery-ui/jquery-ui.min.js', included: true},
      { pattern: 'public/components/moment/min/moment.min.js', included: true},
      { pattern: 'public/components/bootstrap/dist/js/bootstrap.min.js', included: true},
      { pattern: 'public/components/angular/angular.js', included: true},
      { pattern: 'public/components/angular-mocks/angular-mocks.js', included: true},
      { pattern: 'public/components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js', included: true},
      { pattern: 'public/components/angular-bootstrap-datetimepicker/src/js/datetimepicker.templates.js', included: true},
      { pattern: 'public/components/qrcode/lib/qrcode.min.js', included: true},
      { pattern: 'public/components/angular-qr/angular-qr.min.js', included: true},
      { pattern: 'public/components/angular-sanitize/angular-sanitize.min.js', included: true},
      { pattern: 'public/components/angular-resource/angular-resource.min.js', included: true},
      { pattern: 'public/components/angular-route/angular-route.min.js', included: true},
      { pattern: 'public/components/angular-ui-router/release/angular-ui-router.min.js', included: true},
      { pattern: 'public/components/angular-bootstrap/ui-bootstrap-tpls.min.js', included: true},
      { pattern: 'public/modules/angular-select-autocomplete/directive.js', included: true},
      { pattern: 'public/components/aws-sdk/dist/aws-sdk.min.js', included: true},
      { pattern: 'public/components/tinymce/tinymce.min.js', included: true},
      { pattern: 'public/components/ui-select/dist/select.js', included: true},
      { pattern: 'public/components/tinymce/jquery.tinymce.min.js', included: true},
      { pattern: 'public/components/ng-file-upload/ng-file-upload.min.js', included: true},
      { pattern: 'public/components/async/lib/async.js', included: true},
      { pattern: 'public/components/angular-ui-tree/dist/angular-ui-tree.js"', included: true},
      { pattern: 'public/components/ng-table/dist/ng-table.js', included: true},
      { pattern: 'public/modules/ui-tinymce/tinymce.js', included: true},
      { pattern: 'public/modules/multiple_select/multiple_select.js', included: true},
      { pattern: 'public/modules/therapeutic_select/therapeutic_select.js', included: true},
      { pattern: 'public/modules/s3_upload_manager/s3_upload_manager.js', included: true},
      { pattern: 'public/modules/enhacedS3Upload/enhancedS3Upload.js', included: true},
      { pattern: 'public/modules/table-action-buttons/action_buttons.js', included: true},
      { pattern: 'public/modules/admin-emails-list/directive.js', included: true},
      { pattern: 'public/components/angular-animate/angular-animate.js', included: true},
      { pattern: 'public/modules/admin-widget-stats/directive.js', included: true},
      { pattern: 'public/components/ace-builds/src-min-noconflict/ace.js', included: true},
      { pattern: 'public/components/angular-ui-ace/ui-ace.js', included: true},
      { pattern: 'public/components/ng-csv/build/ng-csv.min.js', included: true},
      { pattern: 'public/components/v-accordion/dist/v-accordion.js', included: true},
      { pattern: 'public/components/angular-ui-tree/dist/angular-ui-tree.js', included: true},
      { pattern: 'public/modules/bulk_operations/bulk_operations.js', included: true},
      //{ pattern: 'public/components/angular-ui-tree/dist/angular-ui-tree.js', included: true},
      //{ pattern: 'public/components/angular-ui-tree/dist/angular-ui-tree.js', included: true},
      //{ pattern: 'public/javascript/admin/app.js', included: true},
      //{ pattern: 'public/javascript/admin/controllers.js', included: true},
      //{ pattern: 'public/javascript/admin/services.js', included: true},
      //{ pattern: 'public/javascript/shared/controllers.js', included: true},
      //{ pattern: 'public/javascript/shared/directives.js', included: true},
      //{ pattern: 'public/javascript/shared/services.js', included: true},
      //{ pattern: 'public/javascript/admin/UsersControllers/ManageAccounts/ManageAccounts.js', included: true},
      //{ pattern: 'public/javascript/admin/UsersControllers/ManageAccounts/ViewAccount.js', included: true},

      { pattern: 'public/components/angular-off-click/offClick.js', included: true},
      { pattern: 'public/components/oclazyload/dist/ocLazyLoad.js', included: true},
      { pattern: 'public/modules/mobile_content_list/mobile_content_list.js', included: true},
      { pattern: 'public/modules/sticky-footer/stick_footer.js', included: true},
      { pattern: 'public/modules/horizontal-content-list/directive.js', included: true},
      { pattern: 'public/modules/widget-most-read/directive.js', included: true},
      { pattern: 'public/javascript/shared/services.js', included: true},
      { pattern: 'public/javascript/admin/UsersControllers/ManageAccounts/ManageAccounts.js', included: true},
      { pattern: 'public/javascript/admin/UsersControllers/ManageAccounts/ViewAccount.js', included: true},
      { pattern: 'public/components/angular-ui-tree/dist/angular-ui-tree.js', included: true},
      { pattern: 'public/components/angular-ui-tree/dist/angular-ui-tree.js', included: true},
      { pattern: 'public/javascript/admin/app.js', included: true},
      { pattern: 'public/javascript/admin/controllers.js', included: true},
      { pattern: 'public/javascript/admin/services.js', included: true},
      { pattern: 'public/javascript/shared/controllers.js', included: true},
      { pattern: 'public/javascript/shared/directives.js', included: true},
      { pattern: 'public/javascript/shared/services.js', included: true},
      { pattern: 'public/javascript/admin/UsersControllers/ManageAccounts/ManageAccounts.js', included: true},
      { pattern: 'public/javascript/admin/UsersControllers/ManageAccounts/ViewAccount.js', included: true},
      { pattern: 'public/javascript/public/app.js', included: true},
      { pattern: 'public/javascript/public/controllers.js', included: true},
      { pattern: 'public/javascript/public/services.js', included: true},
      { pattern: 'public/javascript/shared/controllers.js', included: true},
      { pattern: 'public/javascript/shared/directives.js', included: true},
      { pattern: 'public/javascript/shared/services.js', included: true},
      { pattern: 'public/javascript/public/publicDirectives.js', included: true},
      { pattern: 'public/javascript/public/publicFilters.js', included: true},
      { pattern: 'public/javascript/public/RootController.js', included: true},
      { pattern: 'public/javascript/public/AuthControllers/AuthModal.js', included: true, served: true},
      { pattern: 'tests/loginStaywelltest.js', included: true}
    ],


    // list of files to exclude
    exclude: [
     'public/modules/ace-builds/demo/kitchen-sink/demo.js'
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
